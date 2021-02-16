export const infoHtml = (language) => {
  return language === "ro"
    ? `<strong>Relația cazurilor confirmate.<br/>
  Vezi câţi oameni au fost infectaţi de fiecare persoană.</strong> În graficul de mai jos, fiecare cerc reprezintă o persoană, mărimea lui este proporţională cu câţi oameni a infectat 
(= s-au aflat în zona unde virusul a fost răspândit de persoana infectată) iar culoarea reprezintă fie starea (confirmat, eliberat din spital, decedat),
judeţul, genul sau vârsta.<br/>
<strong>Vezi cum sunt legaţi unul de celălalt oamenii infectaţi.</strong> Când o persoană s-a infectat şi a fost cunoscută sursa, acest lucru a fost considerat drept conexiune,
şi reprezentat drept o linie curbă.<br/>
<strong>Vezi unde ar putea apărea focare.</strong> Grupările de oameni, create pe baza conexiunilor, ar putea scoate la iveală posibile focare şi ne-ar putea ajuta să descoperim
locurile şi circumstanţele care pot conduce la focare.<br/>
<strong>Explorează.</strong> Treci pe deasupra fiecărei persoane pentru a vedea cu câţi oameni a intrat în contact, mai multe detalii, şi link-ul web către articolul original
din media. Selectează altă temă pentru a colora toţi oamenii în funcţie de judeţ, gen, localizare sau stare. Zoom înăuntru pentru a afişa etichele, şi pan
pentru a naviga. Schimbă limba (română sau engleză) după preferinţe.<br/><br/>
  <strong>Date</strong> de pe covid19.geo-spatial.org. Doar cazurile pentru care se cunoaște sursa de infectare.<br/>
  <strong>Ultima actualizare a datelor:</strong> 30 iulie 2020.`
    : `<strong>Relationship between confirmed cases.<br/>
  See how many people got infected by each person.</strong> In the visualization below, each circle represents
a person, its size is proportional to how many people has infected (= were found in the area where the virus was spread by an infected person) and the color
represents either status (confirmed, discharged from the hospital, deceased), county, gender or age.<br/>
  <strong>See how the infected people relate to each other.</strong> When a person was infected and the source was known, that was considered a connection, and was represented
as a curved line.<br/>
  <strong>See where outbreaks could occur.</strong> The clusters of people, created based on the connections, could reveal possible hot spots and could help us discover the
locations and the circumstances that can lead to outbreaks.<br/>
  <strong>Explore.</strong> Hover over each person to see how many people got in contact with,  more details, and the link to the original media article. Select another theme
to color all people by county, gender, location or status. Zoom in to reveal labels, and pan to navigate. Switch the language (Romanian or English) as desired.<br/><br/>
  <strong>Data</strong> from covid19.geo-spatial.org. Only cases with known infection source.<br/>
  <strong>The last data update:</strong> 30th of July 2020.`;
};

export const status = (language) => {
  return language === "ro" ? "Stare" : "Status";
};

export const county = (language) => {
  return language === "ro" ? "Județ" : "County";
};

export const gender = (language) => {
  return language === "ro" ? "Gen" : "Gender";
};

export const age = (language) => {
  return language === "ro" ? "Vârstă" : "Age";
};
