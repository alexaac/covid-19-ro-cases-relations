export const infoHtml = (language) => {
    return language === 'ro'
    ? '<strong>Relația cazurilor confirmate. Fiecare punct reprezintă un om.</strong><br/><br/>Date de pe covid19.geo-spatial.org<br/>Doar cazurile pentru care se cunoaște sursa de infectare.'
    : '<strong>Relationship between confirmed cases. Each point represents a person.</strong><br/><br/>Data from covid19.geo-spatial.org<br/>Only cases with known infection source.';
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