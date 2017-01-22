import { Directive, ElementRef, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, Optional, Inject } from '@angular/core';
import { LaddaConfig, LaddaConfigArgs, configAttributes } from "./ladda-config";

@Directive({
    selector: '[ladda]'
})
export class LaddaDirective implements OnInit, OnDestroy, OnChanges {

    private el: HTMLElement;
    private _ladda: any;
    
    @Input('ladda') loading: boolean;
    @Input('disabled') disabled: boolean;

    constructor(el: ElementRef, @Inject(LaddaConfig) @Optional() private config: LaddaConfigArgs) {
        this.el = el.nativeElement;

        if (!this.config) {
            return;
        }

        // apply default styles if they aren't overwritten by an attribute
        for (let attribute in configAttributes) {
            let configValue = this.config[configAttributes[attribute]];

            if (!configValue) {
                continue; // don't waste time reading the attribute
            }

            if (!this.el.getAttribute(attribute)) {
                // attribute isn't set - apply the default config value
                let value = (typeof configValue === "number") ? configValue.toString() : configValue;
                this.el.setAttribute(attribute, value);
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this._ladda) {
            if (changes['loading'] && changes['loading'].currentValue != changes['loading'].previousValue) {
                this.toggleLadda();
            }
            
            if (changes['disabled']) {
                this.toggleDisabled();
            }
        }
    }

    ngOnInit() {
        let Ladda = require('ladda');
        this._ladda = Ladda.create(this.el);
        this.toggleLadda();
    }

    ngOnDestroy() {
        this._ladda.remove();
    }
    
    toggleLadda() {
        if (this.loading) {
            this._ladda.start();
            return;
        }

        this._ladda.stop();
        this.toggleDisabled();
    }
    
    toggleDisabled() {
        if (this.disabled) {
            this.el.setAttribute('disabled', '');
            return;
        }
        
        this.el.removeAttribute('disabled');
    }
}
