export const infoHtml = (language) => {
    return language === 'ro'
    ? '<strong>Relația cazurilor confirmate</strong>.<br/>Situaţia până la data în care s-au raportat oficial aceste informaţii.<br/><br/>Dați click în afara cercului pentru a deselecta.'
    : '<strong>Relationship between confirmed cases</strong>.<br/>The status until the date this information has been officially reported.<br/><br/>Click outside the circle to clear the selection.';
}

export const status = (language) => {
    return language === 'ro'
        ? 'Stare'
        : 'Status';
};

export const county = (language) => {
    return language === 'ro'
        ? 'Județ'
        : 'County';
};

export const gender = (language) => {
    return language === 'ro'
        ? 'Gen'
        : 'Gender';
};

export const age = (language) => {
    return language === 'ro'
        ? 'Vârstă'
        : 'Age';
};