# Aufgabenstellung: Live-Ticker Applikation

## Kontext

Im Rahmen des Projekts soll eine Live-Ticker-Applikation für Sportspiele entwickelt werden. Nutzer sollen Teams und Spieler erfassen und verwalten können, um damit Matches zwischen jeweils zwei Teams durchzuführen. Während eines Matches können relevante Ereignisse wie geschossene Tore und Pausen erfasst werden. Die Applikation richtet sich an kleine Vereine, Hobby-Ligen oder Turnierorganisator:innen, die ohne grossen Aufwand einen digitalen Spielstand-Ticker führen möchten.

## Userstories

### Must have
- Als Admin möchte ich Teams erfassen (Name, Logo), damit ich sie in Matches verwenden kann.
- Als Admin möchte ich Spieler erfassen und Teams zuordnen können, damit ich weiss, wer für welches Team spielt.
- Als Admin möchte ich ein Match zwischen zwei Teams anlegen, damit ein Spiel getrackt werden kann.
- Als Admin möchte ich während eines laufenden Matches Tore erfassen (Team, Spieler, Spielzeit), damit der Spielstand aktuell bleibt.
- Als Nutzer möchte ich eine Ansicht aller laufenden und bevorstehenden Matches sehen.
- Als Nutzer möchte ich den aktuellen Spielstand eines laufenden Matches live abfragen können, damit ich den Spielverlauf verfolgen kann.

### Should have
- Als Admin möchte ich Perioden (Halbzeit, Drittel, etc.) starten/beenden können, damit das Spiel beginnt/endet/in die Pause geht.
- Als Nutzer möchte ich automatisch (ohne Reload) neue Ereignisse (geschossene Tore, Start und Ende von Spielperioden) erhalten, ohne einen Browserrefresh durchzuführen.
- Als Nutzer möchte ich sehen können welche Spieler zu den spielenden Teams gehören, damit ich weiss, wie die Teams aufgebaut sind.

### Could have
- Als Nutzer möchte ich die Applikation auf einem Smartphone installieren können und richtige Push-Benachrichtigungen erhalten.
- Als Nutzer möchte ich die Historie der gespielten Matches anzeigen können, damit ich vergangene Matches anschauen kann.
- Als Nutzer möchte ich sehen, welche Spieler eines Teams an einem spezifischen Match teilgenommen haben.
- Als Admin möchte ich die App auch offline benutzen und erfasste Daten sollen, sobald das Gerät wieder online ist synchronisieren können, damit ich Spiele auch offline korrekt erfassen kann.
- Als Admin möchte Matches kategorisieren können, damit ich so verschiedenen Saisons abbilden kann.

### Won't have
- Verschiedene Berechtigungsrollen
- Spieler- und Teamstatistiken

## Angedachter Technologie-Stack

- **Frontend:** Angular (TypeScript)
- **Backend:** NestJs
- **API:** REST-Schnittstelle zwischen Frontend und Backend
- **Datenbank:** PostgreSQL
- **Live-Updates:** ggf. WebSockets (z. B. Socket.IO) für die Echtzeit-Aktualisierung des Spielstands