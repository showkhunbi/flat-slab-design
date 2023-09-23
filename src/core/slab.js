/* eslint-disable no-throw-literal */
import { selectBar } from "./functions"

const DENSITY_OF_CONCRETE = 24
const DEADLOAD_FACTOR = 1.4
const LIVELOAD_FACTOR = 1.6

class Drop {
    constructor(h, slab) {
        this.slab = slab
        this.l = slab.lx / 3
        this.b = slab.ly / 3
        this.h = h
        this.lx = this.l
        this.ly = this.b
    }

    get selfWeight() {
        return this.h * DENSITY_OF_CONCRETE * this.lx * this.ly
    }
}

class ColumnHead {
    static CIRCULAR = "C"
    static RECTANGULAR = "R"
    constructor(type, dimension, depth, flanged = false, column_dimension, slab) {
        type = type.toUpperCase()
        if (![ColumnHead.CIRCULAR, ColumnHead.RECTANGULAR].includes(type)) throw `Column head type must be of the type "${ColumnHead.CIRCULAR}" or "${ColumnHead.RECTANGULAR}"`
        this.type = type
        this.d = depth
        this.flanged = flanged
        this.column_dimension = column_dimension
        this.slab = slab
        if (this.type === ColumnHead.CIRCULAR) {
            this.l = dimension
        } else if (this.type === ColumnHead.RECTANGULAR) {
            if (!Array.isArray(dimension)) throw "Rectangular Column head dimension must be an array."
            this.l = dimension[0]
            this.b = dimension[1]
        } else {
            throw "Column Head type not found"
        }
    }

    get hc() {
        let effectiveDiameter = this.calculateEffectiveDimension()
        if ((this.slab.lx / 4) < effectiveDiameter) {
            effectiveDiameter = this.slab.lx / 4
        }
        return effectiveDiameter
    }

    calculateEffectiveDimension() {
        let lh_o
        let flanged = this.flanged
        let head_dimension = this.l * 1000
        let column_dimension = this.column_dimension * 1000
        let lh_max = column_dimension + 2 * (this.d - 40)
        if (flanged) {
            lh_o = head_dimension - 2 * (40 / ((this.d * 1000) / ((head_dimension - column_dimension) / 2)))
        } else {
            lh_o = head_dimension
        }
        return [lh_o, lh_max].sort()[0]
    }

    get perimeter() {
        if (this.type === ColumnHead.CIRCULAR) {
            return Math.PI * this.hc
        } else {
            return this.hc * this.hc
        }
    }

}

class FlatSlab {
    static DIVISION_OF_MOMENTS_BETWEEN_STRIPS = {
        negativeMoments: {
            columnStrip: 0.75,
            middleStrip: 0.25,
        },
        positiveMoments: {
            columnStrip: 0.55,
            middleStrip: 0.45,
        },
    }

    constructor(l, b, h, dead_load = 0, live_load = 0, fcu = 25, fy = 460, cover = 25) {
        let dims = [l, b].sort()
        this.lx = dims[0]
        this.ly = dims[1]
        this.h = h
        this.dead_load = dead_load
        this.live_load = live_load
        this.fcu = fcu
        this.fy = fy
        this.cover = cover
    }


    add_drop(d) {
        if (this.drop) throw "Drop panels already added."
        this.drop = new Drop(d, this)
        return this.drop
    }

    add_column_head(...args) {
        if (this.column_head) throw "Column head already added."
        this.column_head = new ColumnHead(...args, this)
        return this.column_head
    }

    get selfWeight() {
        return this.h * DENSITY_OF_CONCRETE * this.lx * this.ly
    }

    get totalDeadLoad() {
        return this.selfWeight + (this.dead_load * this.lx * this.ly) + (this.drop?.selfWeight || 0)
    }

    get ultimateLoad() {
        let totalDeadLoad = this.totalDeadLoad
        let totalLiveLoad = this.live_load * this.lx * this.ly
        return (DEADLOAD_FACTOR * totalDeadLoad) + (LIVELOAD_FACTOR * totalLiveLoad)
    }

    get load() {
        return this.ultimateLoad / (this.lx * this.ly)
    }

    get effectiveSpan() {
        // m
        return this.lx - 2 * ((this.column_head?.hc || 0) / 3)
    }

    get effectiveDepth() {
        return (this.h * 1000) - this.cover - (12 / 2)
    }

    get columnStripLength() {
        if (!this.drop) return this.lx / 2
        return this.drop.lx
    }

    get middleStripLength() {
        return this.lx - this.columnStripLength
    }

    get positiveMoment() {
        // positive moment = 0.071FL KN m
        return 0.071 * this.ultimateLoad * this.effectiveSpan
    }

    get negativeMoment() {
        // negative moment = -0.055FL KN m
        return 0.055 * this.ultimateLoad * this.effectiveSpan
    }

    middleStripMomentFactor(division_factor) {
        let multiplier = 1
        if (this.middleStripLength > this.lx / 2) {
            multiplier = this.middleStripLength / (this.lx / 2)
        }
        // return FlatSlab.DIVISION_OF_MOMENTS_BETWEEN_STRIPS.positiveMoments.middleStrip * multiplier
        return division_factor * multiplier
    }

    columnStripMomentFactor(division_factor) {
        return 1 - this.middleStripMomentFactor(division_factor)
    }

    get middleStripPositiveMoment() {
        return this.middleStripMomentFactor(FlatSlab.DIVISION_OF_MOMENTS_BETWEEN_STRIPS.positiveMoments.middleStrip) * this.positiveMoment
    }

    get columnStripPositiveMoment() {
        return this.columnStripMomentFactor(FlatSlab.DIVISION_OF_MOMENTS_BETWEEN_STRIPS.positiveMoments.middleStrip) * this.positiveMoment
    }

    get middleStripNegativeMoment() {
        return this.middleStripMomentFactor(FlatSlab.DIVISION_OF_MOMENTS_BETWEEN_STRIPS.negativeMoments.middleStrip) * this.negativeMoment
    }

    get columnStripNegativeMoment() {
        return this.columnStripMomentFactor(FlatSlab.DIVISION_OF_MOMENTS_BETWEEN_STRIPS.negativeMoments.middleStrip) * this.negativeMoment
    }

    getSelectBar(section) {
        if (section === "middleStripPositiveMoment") {
            let areaOfSteel = this.As(this.middleStripPositiveMoment, this.middleStripLength * 1000, this.effectiveDepth)
            return selectBar(areaOfSteel, { bar_sizes: [12, 16], span: this.middleStripLength })
        } else if (section === "columnStripPositiveMoment") {
            let areaOfSteel = this.As(this.columnStripPositiveMoment, this.columnStripLength * 1000, this.effectiveDepth)
            return selectBar(areaOfSteel, { bar_sizes: [12, 16], span: this.columnStripLength })
        } else if (section === "middleStripNegativeMoment") {
            let areaOfSteel = this.As(this.middleStripNegativeMoment, this.middleStripLength * 1000, this.effectiveDepth)
            return selectBar(areaOfSteel, { bar_sizes: [12, 16], span: this.middleStripLength })
        } else if (section === "columnStripNegativeMoment") {
            let areaOfSteel = this.As(this.columnStripNegativeMoment, this.columnStripLength * 1000, (this.effectiveDepth + (this.drop?.h || 0)))
            return selectBar(areaOfSteel, { bar_sizes: [12, 16], span: this.columnStripLength })
        }
        throw new Error("Invalid value for section " + section)
    }

    rebarDetails(section) {
        let { AsProvided, noOfBars, barSize } = this.getSelectBar(section)
        return `${noOfBars} R${barSize} (${AsProvided} mm2)`
    }

    get supportEffectiveDepth() {
        return this.effectiveDepth + (this.drop?.h || 0)
    }

    get minimumAs() {
        return (0.13 / 100) * this.lx * 1000 * this.effectiveDepth
    }

    As(M, b, d) {
        let k = ((M * 10 ** 6) / (b * d ** 2 * this.fcu))
        let la = 0.5 + Math.sqrt(0.25 - (k / 0.9))
        if (la > 0.95) la = 0.95
        let leverArm = d * la
        let area_of_steel = ((M * 10 ** 6) / (0.87 * this.fy * leverArm))
        if (area_of_steel < this.minimumAs) area_of_steel = this.minimumAs
        return area_of_steel
    }

    get max_shear_stress_factor() {
        let factors = [0.8 * Math.sqrt(this.fcu), 5]
        factors.sort()
        return factors[0]
    }

    isShearAdequate(shearStress, allowableShearStress = this.max_shear_stress_factor) {
        return shearStress <= allowableShearStress
    }

    get shearForceAtColumnHead() {
        if (!this.column_head) return 0
        return this.ultimateLoad - (((Math.PI * this.column_head?.hc || 0) / 4) * this.load)
    }

    get shearStressAtColumnHead() {
        if (!this.column_head) return 0
        return (1.15 * this.shearForceAtColumnHead) / (this.column_head.perimeter * this.supportEffectiveDepth)
    }

    get shearForceAtFirstCriticalPerimeter() {
        // TODO: Replace || 1 with column dimension
        let first_critical_perimeter = 1.5 * this.supportEffectiveDepth
        return this.ultimateLoad - ((this.column_head?.hc || 1) + (2 * first_critical_perimeter / 1000)) ** 2 * this.load
    }

    get shearStressAtFirstCriticalPerimeter() {
        let first_critical_perimeter = 1.5 * this.supportEffectiveDepth
        let u = 4 * (((this.column_head?.hc || 1) * 1000) + 2 * first_critical_perimeter)
        return (1.15 * this.shearForceAtFirstCriticalPerimeter * 10 ** 3) / (u * this.supportEffectiveDepth)
    }

    get shearForceAtDropCriticalSection() {
        if (!this.drop) return 0
        let critical_section = this.drop.lx + (2 * 1.5 * this.effectiveDepth / 1000)
        return this.ultimateLoad - (critical_section ** 2 * this.load)
    }

    get shearStressAtDropCriticalSection() {
        if (!this.drop) return 0
        let critical_section = this.drop.lx + (2 * 1.5 * this.effectiveDepth / 1000)
        let u = 4 * critical_section * 1000
        return (1.15 * this.shearForceAtDropCriticalSection * 10 ** 3) / (u * this.effectiveDepth)
    }

    get d_req() {
        let fs = (2 / 3) * this.fy
        let MF = 0.55 + ((477 - fs) / (120 * (0.9 + (this.positiveMoment / (this.middleStripLength * this.effectiveDepth ** 2)))))
        if (MF > 2) MF = 2
        return this.lx / (MF * 26)
    }

    isDeflectionAdequate() {
        return this.d_req <= this.effectiveDepth
    }

    get vc() {
        let k1 = (100 * this.As(this.positiveMoment, this.lx * 1000, this.effectiveDepth)) / (this.lx * this.effectiveDepth)
        if (k1 > 3) k1 = 3
        let k2 = 400 / this.effectiveDepth
        if (k2 < 1) k2 = 1
        return 0.79 * (k1 ^ (1 / 3)) * (k2 ^ (1 / 4)) / 1.25
    }
}

export default FlatSlab
// let slab = new FlatSlab(6.5, 6.5, 0.2, 0, 5, 30, 250)
// slab.add_drop(2.5, 2.5, 0.1)
// slab.add_column_head("c", 1.4, 1, true)