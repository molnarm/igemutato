/* Amiben az itt előállított reguláris kifejezés eltér a szentírás.hu nyelvtanától:
 *  - Megengedőbbb a szóközökkel (minden .,;:-| után lehet, de sehol nem kötelező)
 *  - Egész könyves hivatkozást nem fogad el (egy egész könyvet nem lenne túl kényelmes tooltipben olvasni,
 *  	és túl sok hamis pozitívot is eredményezne (Ez, Ének, Zsolt, Ám, Bár stb...)). Ha mégis ezt szeretnénk, kell a végére egy ? és kész.
 *  - a pontosvesszővel elválasztott önálló hivatkozásokat egyenként ismeri fel, nem egyben
 *  - cserébe | helyett ;-t is elfogad fejezet-elválasztónak
 */

// ez kézzel készül, hogy rövid legyen, felismeri az összes jó rövidítést és néhány rosszat, majd bővéteni kell egy kicsit
const books = '(?:[12](?:K(?:[io]r|rón)|Makk?|Pé?t(?:er)?|Sám|T(?:h?essz?|im))|[1-3]Já?n(?:os)?|[1-5]Móz(?:es)?|(?:Ap)?Csel|A(?:gg?|bd)|Ám(?:ós)?|B(?:ár|[ií]r(?:ák)?|ölcs)|Dán|É(?:sa|zs|n(?:ek(?:ek|Én)?)?)|E(?:f(?:éz)?|szt?|z(?:s?dr?)?)|Fil(?:em)?|Gal|H(?:a[bg]|ós)|Iz|J(?:ak|á?n(?:os)?|e[lr]|o(?:el)?|ó(?:[bn]|zs|el)|[Ss]ir(?:alm?)?|úd(?:ás)?|ud(?:it)?)|K(?:iv|ol)|L(?:ev|u?k(?:ács)?)|M(?:al(?:ak)?|á?té?|(?:ár)?k|ik|Törv)|N[áe]h|(?:Ó|O)z|P(?:él|ré)d|R(?:óm|[uú]th?)|S(?:ir(?:alm?)?|ír|z?of|zám)|T(?:er|it|ób)|Z(?:ak|of|s(?:olt|id)?))';

const space = '\\s*';

const verseId = '[0-9]{1,3}[a-z]?';
const chapterId = '[0-9]{1,3}';

// ez itt trükkös, a több fejezet közötti hivatkozás (pl. Mk 1,2-3,4) elejét nem szabad rögtön felismerni verseRange-ként, mert ez majd egy chapterRange lesz!
const verseRange = `${verseId}(?:${space}[-–—]${space}${verseId}\\b(?![,:]))?`;

const verseReference = `${verseRange}(?:\\.${space}${verseRange})*`;
const chapterReference = `${chapterId}(?:[,:]${space}${verseReference})?`;
const chapterRange = `${chapterReference}(?:${space}[-–—]${space}${chapterReference})?`;
const bookReference = `${chapterRange}(?:${space}[\\|;]${space}${chapterRange})*`;

// ékezetek vs \b : http://stackoverflow.com/questions/5436824/matching-accented-characters-with-javascript-regexes
const regex = `(?:^|[^\\w\\u00C0-\\u017F])(${books}\\.?(?:${space}${bookReference}))(?:(?=[^\\w\\u00C0-\\u017F])|$)`;

console.log(regex);
