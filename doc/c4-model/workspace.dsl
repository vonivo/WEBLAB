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

            staticContent = container  "Static Content" {
                description "HTML, CSS, JavaScript, etc."
                tags "Folder"
            }

            spa = container  "Angular-UI" {
                description "Single-app welche die Live-Ticker Funktioanlität dem Benutzer über ihren Webbrowser zur Verfügung stellt."
                tags "Browser"

                group "Shell & Routing" {
                    appShell = component "App Shell" {
                        description "Layout mit Navigation, Side-Nav und Router-Outlet."
                    }
                    router = component "Router" {
                        description "Ordnet Pfade den Pages zu (Lazy Loading) und wendet Guards an."
                    }
                }

                group "Authentication" {
                    authService = component "Auth Service" {
                        description "Hält das JWT (Signal + LocalStorage) und den Login-Status."
                    }
                    authInterceptor = component "Auth Interceptor" {
                        description "Ergänzt alle HTTP-Requests um den Bearer-Token."
                    }
                    routeGuards = component "Route Guards" {
                        description "authGuard und anonymousGuard schützen Routen im Browser."
                    }
                }

                group "Game" {
                    gamePages = component "Game Pages" {
                        description "Übersicht, Detail, Spiel und Ereignis erfassen."
                    }
                    gameContainers = component "Game Smart Containers" {
                        description "Home, Game-Liste, Game-Detail, Add-Game, Add-Event. Enthalten die Dumb Components."
                    }
                    gameService = component "Game Service" {
                        description "Clientseitige Logik: Live/Upcoming-Status, Tore zählen."
                    }
                    gameApi = component "Game API" {
                        description "Zugriff auf /api/games über HttpClient und httpResource."
                    }
                }

                group "Team" {
                    teamPages = component "Team Pages" {
                        description "Team-Übersicht und Team-Detail."
                    }
                    teamContainers = component "Team Smart Containers" {
                        description "Team-Liste mit Erstellen, Ändern und Löschen."
                    }
                    teamApi = component "Team API" {
                        description "Zugriff auf /api/teams."
                    }
                }

                group "Login" {
                    loginContainer = component "Login Container" {
                        description "Registrierung und Anmeldung mit Login-Formular."
                    }
                    webauthnService = component "WebAuthn Service" {
                        description "WebAuthn-Ablauf mit @simplewebauthn/browser und /api/webauthn."
                    }
                }
            }

            backend = container "NestJs Backend" {
                description "NestJs Backend mit REST-API"

                group "GameCenter" {
                    gameController = component "Game Controller" {
                        description "API-Endpoint für Game-Funktionalität"
                    }

                    teamController = component "Team Controller" {
                        description "API-Endpoint für Team-Funktionalität"
                    }

                    gameService = component "Game Service" {
                        description "Kapselt Businesslogik zu Games"
                    }

                    teamService = component "Team Service" {
                        description "Kapselt Businesslogik zu Teams"
                    }
                }

                group "Authentication" {
                    webAuthnController = component "WebAuthn Controller" {
                        description "API-Endpoint für WebAuthn"
                    }


                    authService = component "Authentication Service" {
                        description "Kapselt zur Erstellung des JWT"
                    }

                    userService = component "User Service" {
                        description "Kapselt Businesslogik zu Benutzer"
                    }

                    authGuard = component "Auth Guard" {
                        description "Authentication Guard"
                    }
                }
            }

            database = container "MongoDB" {
                description "MongoDB für die persistente Datenhaltung"
                tags "Database"
            }
        }

        adm -> liveTicker "Erfasst Games/Teams/Events"
        user -> liveTicker "Ruft Informationen zu Spielen ab"
        liveTicker -> user "SPA-Webapplikation"


        user -> liveTicker.staticContent "Lädt UI von"
        user -> liveTicker.spa "Sieht Game Informationen"
        adm -> liveTicker.staticContent "Lädt UI von"
        adm -> liveTicker.spa "Pflegt Games und Teams"
        liveTicker.staticContent -> liveTicker.spa "liefert aus"
        liveTicker.spa -> liveTicker.backend "API-Requests"
        liveTicker.backend -> liveTicker.database "liest und schreibt"

        liveTicker.backend.gameController -> liveTicker.backend.gameService "uses"
        liveTicker.backend.gameController -> liveTicker.backend.authGuard "uses"
        liveTicker.backend.teamController -> liveTicker.backend.teamService "uses"
        liveTicker.backend.teamController -> liveTicker.backend.authGuard "uses"
        liveTicker.backend.gameService -> liveTicker.backend.teamService "uses"
        liveTicker.backend.gameService -> liveTicker.database "uses"
        liveTicker.backend.teamService -> liveTicker.database "uses"
        liveTicker.backend.webAuthnController -> liveTicker.backend.userService "uses"
        liveTicker.backend.webAuthnController -> liveTicker.backend.authService "uses"
        liveTicker.backend.userService -> liveTicker.database "uses"
        liveTicker.backend.authService -> liveTicker.database "uses"


        user -> liveTicker.spa.appShell "Nutzt"
        adm  -> liveTicker.spa.appShell "Nutzt"

        liveTicker.spa.appShell -> liveTicker.spa.router "Rendert Seiten (Router-Outlet)"
        liveTicker.spa.appShell -> liveTicker.spa.authService "Liest Login-Status für Navigation"

        liveTicker.spa.router -> liveTicker.spa.routeGuards "Prüft Zugriff"
        liveTicker.spa.routeGuards -> liveTicker.spa.authService "Liest Login-Status"
        liveTicker.spa.router -> liveTicker.spa.gamePages "Lädt (lazy)"
        liveTicker.spa.router -> liveTicker.spa.teamPages "Lädt (lazy)"
        liveTicker.spa.router -> liveTicker.spa.loginContainer "Lädt (lazy)"

        liveTicker.spa.gamePages -> liveTicker.spa.gameContainers "Bettet ein"
        liveTicker.spa.gamePages -> liveTicker.spa.authService "Liest Login-Status"

        liveTicker.spa.teamPages -> liveTicker.spa.teamContainers "Bettet ein"

        liveTicker.spa.gameContainers -> liveTicker.spa.gameService "Berechnet Status/Tore"
        liveTicker.spa.gameContainers -> liveTicker.spa.gameApi "Lädt/erstellt Spiele und Ereignisse"
        liveTicker.spa.gameContainers -> liveTicker.spa.teamApi "Lädt Teams"
        liveTicker.spa.teamContainers -> liveTicker.spa.teamApi "Verwaltet Teams"

        liveTicker.spa.loginContainer -> liveTicker.spa.webauthnService "Registriert/meldet an"
        liveTicker.spa.webauthnService -> liveTicker.spa.authService "Speichert JWT"

        liveTicker.spa.gameApi -> liveTicker.spa.authInterceptor "HTTP-Request"
        liveTicker.spa.teamApi -> liveTicker.spa.authInterceptor "HTTP-Request"
        liveTicker.spa.webauthnService -> liveTicker.spa.authInterceptor "HTTP-Request"
        liveTicker.spa.authInterceptor -> liveTicker.spa.authService "Liest JWT"
        liveTicker.spa.authInterceptor -> liveTicker.backend "REST/JSON + Bearer-JWT" "HTTPS"
    }

    views {
        systemContext liveTicker "KontextDiagram" {
            include *
        }

        container liveTicker "ContainerDiagram" {
            include *
        }

        component liveTicker.backend "ComponentDiagramBackend" {
            include *
        }

        component liveTicker.spa "ComponentDiagramUI" {
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
            element "Folder" {
                shape folder
            }
            element "Browser" {
                shape webbrowser
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