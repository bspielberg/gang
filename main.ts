namespace SpriteKind {
    export const Putzfrau = SpriteKind.create()
    export const Wurf = SpriteKind.create()
}

// ==========================================================
// JUGENDHERBERGE XANTEN
// SPIELBARER TESTBUILD
// ==========================================================

const PHASE_A = 1
const PHASE_B = 2

let phase = PHASE_A

let aStart = 0
let bStart = 0

let hatKissen = false
let blickRichtung = 1

let putzfrauAktiv = true
let putzfrauKommtWieder = 0
let schutzBis = 0


// ==========================================================
// HINTERGRUND-ASSET
// ==========================================================

// WICHTIG:
// Das Asset in GitHub / MakeCode muss "gang" heißen.

scene.setBackgroundImage(
    assets.image`gang`
)


// ==========================================================
// SPIELER
// ==========================================================

let spieler = sprites.create(img`
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
`, SpriteKind.Player)

spieler.setStayInScreen(true)


// ==========================================================
// PUTZFRAU
// ==========================================================

let putzfrau = sprites.create(img`
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
`, SpriteKind.Putzfrau)

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
// A START
// ==========================================================

function starteA() {
    phase = PHASE_A

    spieler.setImage(
        bildA()
    )

    spieler.setPosition(
        80,
        75
    )

    controller.moveSprite(
        spieler,
        0,
        0
    )

    spieler.vx = 25
    spieler.vy = 10

    putzfrau.setPosition(
        20,
        105
    )

    putzfrau.vx = 0
    putzfrau.vy = 0

    aStart = game.runtime()

    info.setScore(5)
}


// ==========================================================
// B START
// ==========================================================

function starteB() {
    phase = PHASE_B

    // A-Bewegung beenden
    spieler.vx = 0
    spieler.vy = 0

    spieler.setImage(
        bildB()
    )

    spieler.setPosition(
        80,
        80
    )

    // JETZT STEUERUNG EINSCHALTEN
    controller.moveSprite(
        spieler,
        75,
        65
    )

    bStart = game.runtime()

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

    // 4 Sekunden Schutz
    schutzBis =
        game.runtime() + 4000

    info.setScore(0)

    spieler.sayText(
        "B - LOS!",
        1000,
        false
    )
}


// ==========================================================
// A LÄUFT 5 SEKUNDEN
// ==========================================================

game.onUpdate(function () {
    if (phase != PHASE_A) {
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

    // A im sichtbaren Bereich halten
    if (spieler.x < 15) {
        spieler.vx = 30
    }

    if (spieler.x > 145) {
        spieler.vx = -30
    }

    if (spieler.y < 60) {
        spieler.vy = 20
    }

    if (spieler.y > 105) {
        spieler.vy = -20
    }

    if (zeit >= 5000) {
        starteB()
    }
})


// ==========================================================
// A ÄNDERT RICHTUNG
// ==========================================================

game.onUpdateInterval(
    600,
    function () {
        if (phase != PHASE_A) {
            return
        }

        spieler.vx =
            randint(-35, 35)

        spieler.vy =
            randint(-20, 20)
    }
)


// ==========================================================
// B UPDATE
// ==========================================================

game.onUpdate(function () {
    if (phase != PHASE_B) {
        return
    }

    // Zeit hochzählen
    let bZeit =
        game.runtime() -
        bStart

    info.setScore(
        Math.floor(
            bZeit / 1000
        )
    )

    // Blickrichtung merken
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

    // B im Gang halten
    if (spieler.y < 58) {
        spieler.y = 58
    }

    if (spieler.y > 108) {
        spieler.y = 108
    }
})


// ==========================================================
// PUTZFRAU VERFOLGT B
// ==========================================================

game.onUpdate(function () {
    if (phase != PHASE_B) {
        putzfrau.vx = 0
        putzfrau.vy = 0
        return
    }

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
                game.runtime() + 2000
        }

        return
    }

    let dx =
        spieler.x -
        putzfrau.x

    let dy =
        spieler.y -
        putzfrau.y

    let tempo = 13

    if (dx > 6) {
        putzfrau.vx = tempo
    } else if (dx < -6) {
        putzfrau.vx = -tempo
    } else {
        putzfrau.vx = 0
    }

    if (dy > 6) {
        putzfrau.vy = tempo
    } else if (dy < -6) {
        putzfrau.vy = -tempo
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

        if (phase != PHASE_B) {
            return
        }

        if (!putzfrauAktiv) {
            return
        }

        if (
            game.runtime() <
            schutzBis
        ) {
            return
        }

        // Für Test noch kein Game Over
        spieler.sayText(
            "ERWISCHT!",
            600,
            false
        )

        spieler.setPosition(
            80,
            80
        )

        putzfrau.setPosition(
            15,
            108
        )

        schutzBis =
            game.runtime() + 2500
    }
)


// ==========================================================
// A-TASTE = TÜR ERKENNEN
// ==========================================================

controller.A.onEvent(
    ControllerButtonEvent.Pressed,
    function () {

        if (phase != PHASE_B) {
            return
        }

        let tuer = ""

        if (spieler.x < 28) {
            tuer = "4A"
        } else if (spieler.x < 55) {
            tuer = "KUECHE"
        } else if (spieler.x < 76) {
            tuer = "LEHRER"
        } else if (spieler.x < 100) {
            tuer = "PUTZ"
        } else if (spieler.x < 132) {
            tuer = "BAD"
        } else {
            tuer = "4B"
        }

        spieler.sayText(
            tuer,
            600,
            false
        )
    }
)


// ==========================================================
// B-TASTE = KISSEN WERFEN
// ==========================================================

controller.B.onEvent(
    ControllerButtonEvent.Pressed,
    function () {

        if (phase != PHASE_B) {
            return
        }

        if (!hatKissen) {
            spieler.sayText(
                "KEIN KISSEN",
                400,
                false
            )

            return
        }

        hatKissen = false

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
    function (wurf, frau) {

        if (phase != PHASE_B) {
            return
        }

        wurf.destroy()

        if (!putzfrauAktiv) {
            return
        }

        putzfrauAktiv = false

        frau.vx = 0
        frau.vy = 0

        frau.setFlag(
            SpriteFlag.Invisible,
            true
        )

        // 2 Minuten verschwunden
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
// START
// ==========================================================

starteA()