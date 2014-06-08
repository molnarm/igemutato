igemutato
=========

*Ez itt fejlesztőknek szóló leírás, a felhasználói [itt](http://molnarm.github.io/igemutato/) található.* 

A weboldalak szövegében található szentírási hivakozásokat jeleníti meg, ha rávisszük az egeret. Felismer minden könyv-rövidítést, ami a szentiras.hu szerint helyes (és néhány hibásat is, ezek listája várhatóan bővülni fog).

Hivatkozások felismerése
------------------------

Nagyjából ugyanazokat a formátumokat fogadja el, mint amiket a szentiras.hu [értelmezője](https://github.com/borazslo/szentiras.hu/blob/mvc/app/lib/Reference/ReferenceParser.php) kezelni tud.  
Az eltérések:  
-   Megengedőbb a szóközökkel (minden .,;:-| után lehet, de sehol nem kötelező)  
-   Egész könyves hivatkozást nem fogad el (egy egész könyvet nem lenne túl kényelmes tooltipben olvasni,	és túl sok hamis pozitívot is eredményezne (Ez, Ének, Zsolt, Ám, Bár stb...)).  
-   a pontosvesszővel elválasztott önálló hivatkozásokat egyenként ismeri fel, nem egyben  
-   cserébe | helyett ;-t is elfogad fejezet-elválasztónak

Megjelenítés
------------

A bővítményeknél a beállítások között megadható a megjelenő szövegdoboz mérete, a megjelenés és elrejtés ideje, illetve a betűméret. Később a színek is beállíthatók lesznek, de oldalba ágyazáskor nyilván saját CSS-t is lehet használni.

Fejlesztői dolgok
-----------------

A build folyamat egyelőre Windowsos eszközökkel van összeállítva (cmd, PowerShell). A kódban lehet feltételes részeket elhelyezni, amik a bővítményeknél egyedi részek használatát teszik lehetővé. Ezek formátuma:  

    // #if FELTÉTEL  
    ...  
    // #endif FELTÉTEL  

Feltételt lehet negálni is, `!FELTÉTEL` formában.

Igazából egyelőre csak pluginként használható a szkript, mivel a szentiras.hu oldalon még nincs CORS támogatás (JSON-P van, esetleg majd a beágyazható változatban (`EMBEDDED`) addig is meg lehetne valósítani azzal a lekérdezést).
