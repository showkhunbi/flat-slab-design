// Function to calculate factored loads
function calculateFactoredLoads(liveLoad, deadLoad, liveLoadFactor, deadLoadFactor) {
    const factoredLiveLoad = liveLoad * liveLoadFactor;
    const factoredDeadLoad = deadLoad * deadLoadFactor;
    return factoredLiveLoad + factoredDeadLoad;
}

// Function to calculate maximum moments
function calculateMaximumMoments(span, factoredLoads) {
    const positiveMomentMidSpan = factoredLoads * span * span / 8;
    const negativeMomentMidSpan = factoredLoads * span * span / 8;
    const positiveMomentNearColumns = factoredLoads * span * span / 12;
    const negativeMomentNearColumns = factoredLoads * span * span / 12;
    return {
        positiveMomentMidSpan,
        negativeMomentMidSpan,
        positiveMomentNearColumns,
        negativeMomentNearColumns,
    };
}

// Function to calculate required steel area for positive moments
function calculateRequiredSteelAreaPositiveMoments(moment, concreteGrade, steelGrade) {
    const fck = 5 * Math.sqrt(concreteGrade); // Characteristic strength of concrete
    const fy = steelGrade; // Yield strength of steel
    const effectiveDepth = moment / (0.87 * fy);
    const Ast = (moment * 1000000) / (0.87 * fy * effectiveDepth);
    return Ast; // Steel area in square millimeters
}

// Function to calculate required steel area for negative moments
function calculateRequiredSteelAreaNegativeMoments(moment, concreteGrade, steelGrade) {
    const fck = 5 * Math.sqrt(concreteGrade); // Characteristic strength of concrete
    const fy = steelGrade; // Yield strength of steel
    const effectiveDepth = Math.sqrt((moment * 1000000) / (0.138 * fck));
    const Ast = (moment * 1000000) / (0.87 * fy * effectiveDepth);
    return Ast; // Steel area in square millimeters
}

// Sample input parameters
const liveLoad = 10; // kN/m2
const deadLoad = 15; // kN/m2
const liveLoadFactor = 1.5;
const deadLoadFactor = 1.2;
const span = 5; // meters
const concreteGrade = 25; // MPa
const steelGrade = 500; // MPa

// Calculate factored loads
const factoredLoads = calculateFactoredLoads(liveLoad, deadLoad, liveLoadFactor, deadLoadFactor);

// Calculate maximum moments
const maximumMoments = calculateMaximumMoments(span, factoredLoads);

// Calculate required steel area for positive moments
const AstPositiveMomentsMidSpan = calculateRequiredSteelAreaPositiveMoments(maximumMoments.positiveMomentMidSpan, concreteGrade, steelGrade);
const AstPositiveMomentsNearColumns = calculateRequiredSteelAreaPositiveMoments(maximumMoments.positiveMomentNearColumns, concreteGrade, steelGrade);

// Calculate required steel area for negative moments
const AstNegativeMomentsMidSpan = calculateRequiredSteelAreaNegativeMoments(maximumMoments.negativeMomentMidSpan, concreteGrade, steelGrade);
const AstNegativeMomentsNearColumns = calculateRequiredSteelAreaNegativeMoments(maximumMoments.negativeMomentNearColumns, concreteGrade, steelGrade);

// Output the results
console.log("Factored Loads:", factoredLoads, "kN/m2");
console.log("Positive Moments at Mid-Span:", maximumMoments.positiveMomentMidSpan, "kNm");
console.log("Positive Moments near Columns:", maximumMoments.positiveMomentNearColumns, "kNm");
console.log("Required Steel Area for Positive Moments at Mid-Span:", AstPositiveMomentsMidSpan, "mm2");
console.log("Required Steel Area for Positive Moments near Columns:", AstPositiveMomentsNearColumns, "mm2");
console.log("Negative Moments at Mid-Span:", maximumMoments.negativeMomentMidSpan, "kNm");
console.log("Negative Moments near Columns:", maximumMoments.negativeMomentNearColumns, "kNm");
console.log("Required Steel Area for Negative Moments at Mid-Span:", AstNegativeMomentsMidSpan, "mm2");
console.log("Required Steel Area for Negative Moments near Columns:", AstNegativeMomentsNearColumns, "mm2");
