namespace SpriteKind {
    export const Putzfrau = SpriteKind.create()
    export const Wurf = SpriteKind.create()
}

// ==========================================================
// JUGENDHERBERGE XANTEN
// main.ts
//
// A ROT:
// - läuft 5 Sekunden automatisch
//
// B BLAU:
// - danach steuerbar
// - Steuerkreuz = laufen
// - A = Tür erkennen
// - B = Kissen werfen
//
// Hintergrund:
// assets.image`gang`
// ==========================================================


// ==========================================================
// SPIELPHASEN
// ==========================================================

const PHASE_A = 1
const PHASE_B = 2

let phase = PHASE_A


// ==========================================================
// STATUS
// ==========================================================

let aStart = 0
let bStart = 0

let blickRichtung = 1

let hatKissen = false

let putzfrauAktiv = true

let putzfrauKommtWieder = 0

let schutzBis = 0


// ==========================================================
// HINTERGRUND
// ==========================================================

// Das Asset aus gang.ts
scene.setBackgroundImage(
    assets.image`gang`
)


// ==========================================================
// SPIELER
// ==========================================================

let spieler = sprites.create(
    img`
        . . . 2 2 2 2 . . .
        . . 2 2 2 2 2 2 . .
        . 2 2 2 2 2 2 2 2 .
        . . . 5 5 5 5 . . .
        . . 5 5 5 5 5 5 . .
        . . . 2 2 2 2 . . .
        . . 2 2 2 2 2 2 . .
        . 2 2 2 2 2 2 2 2 .
        . . 2 2 2 2 2 2 . .
        . . 2 2 . . 2 2 . .
        . 2 2 . . . . 2 2 .
    `,
    SpriteKind.Player
)

spieler.setStayInScreen(true)


// ==========================================================
// PUTZFRAU
// ==========================================================

let putzfrau = sprites.create(
    img`
        . . . 8 8 8 8 . . .
        . . 8 8 8 8 8 8 . .
        . 8 8 8 8 8 8 8 8 .
        . . 8 8 8 8 8 8 . .
        . . . 5 5 5 5 . . .
        . . 5 5 5 5 5 5 . .
        . . . a a a a . . .
        . . a a a a a a . .
        . a a a 1 1 a a a .
        . . a a 1 1 a a . .
        . . a a a a a a . .
        . . a . . . . a . .
    `,
    SpriteKind.Putzfrau
)

putzfrau.setStayInScreen(true)


// ==========================================================
// A ROT
// ==========================================================

function bildA(): Image {
    return img`
        . . . 2 2 2 2 . . .
        . . 2 2 2 2 2 2 . .
        . 2 2 2 2 2 2 2 2 .
        . . . 5 5 5 5 . . .
        . . 5 5 5 5 5 5 . .
        . . . 2 2 2 2 . . .
        . . 2 2 2 2 2 2 . .
        . 2 2 2 2 2 2 2 2 .
        . . 2 2 2 2 2 2 . .
        . . 2 2 . . 2 2 . .
        . 2 2 . . . . 2 2 .
    `
}


// ==========================================================
// B BLAU
// ==========================================================

function bildB(): Image {
    return img`
        . . . 8 8 8 8 . . .
        . . 8 8 8 8 8 8 . .
        . 8 8 8 8 8 8 8 8 .
        . . . 5 5 5 5 . . .
        . . 5 5 5 5 5 5 . .
        . . . 8 8 8 8 . . .
        . . 8 8 8 8 8 8 . .
        . 8 8 8 8 8 8 8 8 .
        . . 8 8 8 8 8 8 . .
        . . 8 8 . . 8 8 . .
        . 8 8 . . . . 8 8 .
    `
}


// ==========================================================
// A STARTEN
// ==========================================================

function starteA() {

    phase = PHASE_A

    spieler.setImage(
        bildA()
    )

    spieler.setPosition(
        80,
        76
    )

    // A nicht steuerbar
    controller.moveSprite(
        spieler,
        0,
        0
    )

    // automatische Startbewegung
    spieler.vx = 25
    spieler.vy = 10

    putzfrau.setPosition(
        20,
        105
    )

    putzfrau.vx = 0
    putzfrau.vy = 0

    putzfrau.setFlag(
        SpriteFlag.Invisible,
        false
    )

    putzfrauAktiv = true

    aStart =
        game.runtime()

    info.setScore(5)
}


// ==========================================================
// B STARTEN
// ==========================================================

function starteB() {

    phase = PHASE_B

    // A-Bewegung stoppen
    spieler.vx = 0
    spieler.vy = 0

    spieler.setImage(
        bildB()
    )

    spieler.setPosition(
        80,
        82
    )

    // WICHTIG:
    // Jetzt wird B steuerbar
    controller.moveSprite(
        spieler,
        75,
        65
    )

    bStart =
        game.runtime()

    hatKissen = true

    putzfrauAktiv = true

    putzfrau.setFlag(
        SpriteFlag.Invisible,
        false
    )

    putzfrau.setPosition(
        15,
        108
    )

    putzfrau.vx = 0
    putzfrau.vy = 0

    // B hat 4 Sekunden Schutz
    schutzBis =
        game.runtime() +
        4000

    info.setScore(0)

    spieler.sayText(
        "B - LOS!",
        1000,
        false
    )
}


// ==========================================================
// A AUTOMATISCHE BEWEGUNG
// ==========================================================

game.onUpdateInterval(
    600,
    function () {

        if (
            phase != PHASE_A
        ) {
            return
        }

        spieler.vx =
            randint(-35, 35)

        spieler.vy =
            randint(-20, 20)
    }
)


// ==========================================================
// A LÄUFT 5 SEKUNDEN
// ==========================================================

game.onUpdate(function () {

    if (
        phase != PHASE_A
    ) {
        return
    }

    let zeit =
        game.runtime() -
        aStart

    let rest =
        5 -
        Math.floor(
            zeit / 1000
        )

    if (rest < 0) {
        rest = 0
    }

    info.setScore(rest)

    // A im Gang halten

    if (
        spieler.x < 15
    ) {
        spieler.vx = 30
    }

    if (
        spieler.x > 145
    ) {
        spieler.vx = -30
    }

    if (
        spieler.y < 58
    ) {
        spieler.vy = 25
    }

    if (
        spieler.y > 108
    ) {
        spieler.vy = -25
    }

    // Nach 5 Sekunden B starten

    if (
        zeit >= 5000
    ) {
        starteB()
    }
})


// ==========================================================
// B UPDATE
// ==========================================================

game.onUpdate(function () {

    if (
        phase != PHASE_B
    ) {
        return
    }

    let zeit =
        game.runtime() -
        bStart

    info.setScore(
        Math.floor(
            zeit / 1000
        )
    )

    // Blickrichtung

    if (
        controller.left.isPressed()
    ) {
        blickRichtung = -1
    }

    if (
        controller.right.isPressed()
    ) {
        blickRichtung = 1
    }

    // B im Bodenbereich halten

    if (
        spieler.y < 58
    ) {
        spieler.y = 58
    }

    if (
        spieler.y > 108
    ) {
        spieler.y = 108
    }
})


// ==========================================================
// PUTZFRAU
// ==========================================================

game.onUpdate(function () {

    // während A keine Verfolgung

    if (
        phase != PHASE_B
    ) {
        putzfrau.vx = 0
        putzfrau.vy = 0

        return
    }


    // Putzfrau nach Treffer weg

    if (!putzfrauAktiv) {

        putzfrau.vx = 0
        putzfrau.vy = 0

        if (
            game.runtime() >=
            putzfrauKommtWieder
        ) {

            putzfrauAktiv = true

            putzfrau.setFlag(
                SpriteFlag.Invisible,
                false
            )

            putzfrau.setPosition(
                15,
                108
            )

            schutzBis =
                game.runtime() +
                2000
        }

        return
    }


    // Spieler verfolgen

    let dx =
        spieler.x -
        putzfrau.x

    let dy =
        spieler.y -
        putzfrau.y

    let tempo = 13


    if (
        dx > 6
    ) {
        putzfrau.vx =
            tempo
    } else if (
        dx < -6
    ) {
        putzfrau.vx =
            -tempo
    } else {
        putzfrau.vx = 0
    }


    if (
        dy > 6
    ) {
        putzfrau.vy =
            tempo
    } else if (
        dy < -6
    ) {
        putzfrau.vy =
            -tempo
    } else {
        putzfrau.vy = 0
    }
})


// ==========================================================
// PUTZFRAU BERÜHRT B
// ==========================================================

sprites.onOverlap(
    SpriteKind.Player,
    SpriteKind.Putzfrau,
    function () {

        if (
            phase != PHASE_B
        ) {
            return
        }

        if (
            !putzfrauAktiv
        ) {
            return
        }

        if (
            game.runtime() <
            schutzBis
        ) {
            return
        }


        // Test:
        // noch kein endgültiges Game Over

        spieler.sayText(
            "ERWISCHT!",
            600,
            false
        )

        spieler.setPosition(
            80,
            82
        )

        putzfrau.setPosition(
            15,
            108
        )

        schutzBis =
            game.runtime() +
            2500
    }
)


// ==========================================================
// A-TASTE
// TÜR ERKENNEN
// ==========================================================

controller.A.onEvent(
    ControllerButtonEvent.Pressed,
    function () {

        if (
            phase != PHASE_B
        ) {
            return
        }

        let tuer = ""


        // Spieler ganz links

        if (
            spieler.x < 28
        ) {

            tuer = "4A"

        } else if (
            spieler.x < 55
        ) {

            tuer = "KUECHE"

        } else if (
            spieler.x < 76
        ) {

            tuer = "LEHRER"

        } else if (
            spieler.x < 100
        ) {

            tuer = "PUTZ"

        } else if (
            spieler.x < 132
        ) {

            tuer = "BAD"

        } else {

            tuer = "4B"
        }


        spieler.sayText(
            tuer,
            700,
            false
        )
    }
)


// ==========================================================
// B-TASTE
// KISSEN WERFEN
// ==========================================================

controller.B.onEvent(
    ControllerButtonEvent.Pressed,
    function () {

        if (
            phase != PHASE_B
        ) {
            return
        }


        if (
            !hatKissen
        ) {

            spieler.sayText(
                "KEIN KISSEN",
                400,
                false
            )

            return
        }


        hatKissen =
            false


        let wurf =
            sprites.createProjectileFromSprite(
                img`
                    . 1 1 1 1 .
                    1 1 1 1 1 1
                    1 1 1 1 1 1
                    . 1 1 1 1 .
                `,
                spieler,
                -blickRichtung * 120,
                0
            )


        wurf.setKind(
            SpriteKind.Wurf
        )
    }
)


// ==========================================================
// KISSEN TRIFFT PUTZFRAU
// ==========================================================

sprites.onOverlap(
    SpriteKind.Wurf,
    SpriteKind.Putzfrau,
    function (
        wurf,
        frau
    ) {

        if (
            phase != PHASE_B
        ) {
            return
        }


        wurf.destroy()


        if (
            !putzfrauAktiv
        ) {
            return
        }


        putzfrauAktiv =
            false


        frau.vx = 0
        frau.vy = 0


        frau.setFlag(
            SpriteFlag.Invisible,
            true
        )


        // 2 Minuten weg

        putzfrauKommtWieder =
            game.runtime() +
            120000


        spieler.sayText(
            "TREFFER!",
            700,
            false
        )
    }
)


// ==========================================================
// SPIELSTART
// ==========================================================

starteA()
