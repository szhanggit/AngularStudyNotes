import { trigger, style, state, transition, animate } from "@angular/animations";

const commonStyles = {
    border: "black solid 4px",
    color: "white"
};

export const HighlightTrigger = trigger("rowHighlight", [
    state("selected", style([commonStyles, {
        backgroundColor: "lightgreen",
        fontSize: "20px"
    }])),
    state("notselected", style([commonStyles, {
        backgroundColor: "lightsalmon",
        fontSize: "12px",
        color: "black"
    }])),
    state("void", style({
        opacity: 0
    })),
    transition("* => notselected", animate("200ms")),
    transition("* => selected", animate("400ms 200ms ease-in")),
    transition("void => *", animate("500ms"))
]);