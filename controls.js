class Controls {

    constructor() {

        this.keys = {};

        this.joystickX = 0;
        this.joystickY = 0;

        this.joystick = document.getElementById("joystick");
        this.stick = document.getElementById("joystickStick");

        this.joystickActive = false;

        this.setupKeyboard();
        this.setupJoystick();
    }

    setupKeyboard() {

        window.addEventListener("keydown", (event) => {
            this.keys[event.key.toLowerCase()] = true;
        });

        window.addEventListener("keyup", (event) => {
            this.keys[event.key.toLowerCase()] = false;
        });
    }

    setupJoystick() {

        this.joystick.addEventListener(
            "pointerdown",
            (event) => {

                event.preventDefault();

                this.joystickActive = true;

                this.joystick.setPointerCapture(
                    event.pointerId
                );

                this.moveJoystick(event);
            }
        );

        this.joystick.addEventListener(
            "pointermove",
            (event) => {

                if (!this.joystickActive) return;

                event.preventDefault();

                this.moveJoystick(event);
            }
        );

        this.joystick.addEventListener(
            "pointerup",
            () => {

                this.joystickActive = false;

                this.joystickX = 0;
                this.joystickY = 0;

                this.stick.style.left = "50%";
                this.stick.style.top = "50%";
            }
        );

        this.joystick.addEventListener(
            "pointercancel",
            () => {

                this.joystickActive = false;

                this.joystickX = 0;
                this.joystickY = 0;

                this.stick.style.left = "50%";
                this.stick.style.top = "50%";
            }
        );
    }

    moveJoystick(event) {

        const rect = this.joystick.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let x = event.clientX - centerX;
        let y = event.clientY - centerY;

        const maxDistance = 32;

        const distance = Math.hypot(x, y);

        if (distance > maxDistance) {

            x = (x / distance) * maxDistance;
            y = (y / distance) * maxDistance;
        }

        this.joystickX = x / maxDistance;
        this.joystickY = y / maxDistance;

        this.stick.style.left =
            `calc(50% + ${x}px)`;

        this.stick.style.top =
            `calc(50% + ${y}px)`;
    }

    getMovement() {

        let x = 0;
        let y = 0;

        if (
            this.keys["w"] ||
            this.keys["arrowup"]
        ) {
            y -= 1;
        }

        if (
            this.keys["s"] ||
            this.keys["arrowdown"]
        ) {
            y += 1;
        }

        if (
            this.keys["a"] ||
            this.keys["arrowleft"]
        ) {
            x -= 1;
        }

        if (
            this.keys["d"] ||
            this.keys["arrowright"]
        ) {
            x += 1;
        }

        x += this.joystickX;
        y += this.joystickY;

        const length = Math.hypot(x, y);

        if (length > 1) {

            x /= length;
            y /= length;
        }

        return {
            x,
            y
        };
    }
}