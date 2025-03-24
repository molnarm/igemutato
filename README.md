igemutato
=========

*Ez itt fejlesztőknek szóló leírás, a felhasználói [itt](https://molnarm.github.io/igemutato/) található.* 

A weboldalak szövegében található szentírási hivakozásokat jeleníti meg, ha rávisszük az egeret. Felismer minden könyv-rövidítést, ami a szentiras.eu szerint helyes (és néhány hibásat is, ezek listája várhatóan bővülni fog).

Hivatkozások felismerése
------------------------

Nagyjából ugyanazokat a formátumokat fogadja el, mint amiket a szentiras.eu értelmezője kezelni tud.  
Az eltérések:  
-   Megengedőbb a szóközökkel (minden .,;:-| után lehet, de sehol nem kötelező)  
-   Egész könyves hivatkozást nem fogad el (egy egész könyvet nem lenne túl kényelmes tooltipben olvasni,	és túl sok hamis pozitívot is eredményezne (Ez, Ének, Zsolt, Ám, Bár stb...)).  
-   a pontosvesszővel elválasztott önálló hivatkozásokat egyenként ismeri fel, nem egyben  
-   cserébe | helyett ;-t is elfogad fejezet-elválasztónak