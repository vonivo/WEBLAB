workspace "Live Ticker" "DSL of Live Ticker c4 model" {
    !identifiers hierarchical

    model {
        user = person "User" {
            description "Benutzer welcher die Live Ticker Applikation nutzt.
        }
        adm = person "Admin" {
            description "Admin benutzer welches Teams, Games und Events verwaltet."
        }

        liveTicker = softwareSystem "Live Ticker" {
            description "Live Ticker Web-Application."
        }

        adm -> liveTicker "Erfasst Games/Teams/Events"
        user -> liveTicker "Ruft Infromationen zu Spielen ab"
        liveTicker -> user "SPA-Webapplikation"
    }

    views {
        systemContext liveTicker "KontextDiagram" {
            include *
        }

        styles {
            element "Element" {
                color #0066b3
                stroke #0066b3
                strokeWidth 7
                shape roundedbox
            }
            element "Person" {
                shape person
            }
            element "Database" {
                shape cylinder
            }
            element "Boundary" {
                strokeWidth 5
            }
            relationship "Relationship" {
                thickness 4
            }
        }
    }

    configuration {
        scope softwaresystem
    }
}