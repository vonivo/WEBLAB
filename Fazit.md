# Fazit & Reflexion
Alles in allem ist das Projekt 'Live-Ticker' gut verlaufen und ich habe viel gelernt.
Ich habe mich schnell mit den gewählten Technologien (Angular, NestJs, etc.)
zurechtgefunden und kam so bei der Implementation gut voran.
Es war sehr spannend, neuere Features von Angular, wie Signals, Signal-Forms
und HttpResourceRefs zu benutzen. Auch habe ich mich trotz wenig Erfahrung
schnell mit Tailwind CSS und der Angular Material Components Library
zurechtgefunden.

Auch der Einsatz von KI hat meines Erachtens gut funktioniert. KI kam vor
allem unterstützen beim UI-Design oder bei sich wiederholenden Aufgaben
(z.B. das Setup von Unit-Tests) zum Einsatz. Auch beim Schreiben von
komplizierteren Unit-Tests konnte KI beim Setup von den richtigen Mocks
sehr hilfreich sein.


Herausfordernd war für mich einerseits die Definition des Datenschemas, da
ich bisher noch keine grosse Erfahrung mit NoSQL-Datenbanken hatte.
Daher musste ich das Datenschema während der Entwicklung auch ein paar mal
anpassen und verändern.

Ebenfalls eine Herausforderung war für mich die Strukturierung des
Frontend-Projekts. Begonnen habe ich mit einer Aufteilung in Features.
Diese Aufteilung an sich war gut gewählt und hat bis jetzt Bestand. Die
Herausforderung war vor allem die Strukturierung innerhalb der Features.
Zuerst habe ich innerhalb der Features nur zwischen Dumb-Component und
Smart-Containers unterschieden, später benötigte ich dann teilweise
trotzdem noch dedizierte Page-Components was dann zu ein paar Refactorings
geführt hat.

Die Bundle-Size in Zusammenhang mit der Performance-Wertung von Lighthouse
war auch noch eine Herausforderung. Durch die Material Component Library
wurde irgendwann meine Bundle-Size zu gross. Als Gegenmassnahme habe ich
dann auf Lazy-Loading umgestellt. Dies hat die Bundle-Size verbessert
jedoch die Performance in der Mobile-Wertung verschlechtert.

Im nächsten Projekt würde ich vor allem mit der Dokumentation früher
beginnen und nicht erst am Ende des Projekts, um so den "langweiligeren"
Teil etwas aufteilen zu können. Ebenfalls habe ich anfangs die Unit-Tests im
Backend etwas vernachlässigt, was dazu führte, dass auf einmal relativ viele
Tests geschrieben werden mussten.

Für mich war das Projekt lehrreich, hat Spass gemacht und ich könnte mir
vorstellen, dass ich die fehlenden Funktionalitäten wie WebSockets und
die PWA-Funktionalität noch ergänzen werde.