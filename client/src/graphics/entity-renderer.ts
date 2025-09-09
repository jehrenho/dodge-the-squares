import { RenderData } from './render-data.js';
import { MODIFIER_COLOURS, HAZARD_COLOURS, PLAYER_COLOURS, ENTITY_OUTLINE_WIDTH, COLLISION_COLOURS } from './colours.js';

// Renders game entities (player, hazards, modifiers)
export class EntityRenderer {
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    render(renderData: RenderData[]): void {
        this.renderModifiers(renderData);
        this.renderHazards(renderData);
        this.renderPlayer(renderData);
    }
    
    private renderModifiers(renderData: RenderData[]): void {
        for (let i = renderData.length - 1; i >= 0; i--) {
            const entity = renderData[i];
            if (entity.type === "modifier") {
                // determine colours based on modifier type
                let fillColour: string = "";
                let outlineColour: string = "";
                if (entity.flashOn) {
                    fillColour = COLLISION_COLOURS.fillColour;
                    outlineColour = COLLISION_COLOURS.outlineColour;
                } else {
                    switch (entity.modifierType) {
                        case "INVINCIBILITY":
                        fillColour = MODIFIER_COLOURS.INVINCIBILITY.fillColour;
                        outlineColour = MODIFIER_COLOURS.INVINCIBILITY.outlineColour;
                        break;
                        case "ICE_RINK":
                        fillColour = MODIFIER_COLOURS.ICE_RINK.fillColour;
                        outlineColour = MODIFIER_COLOURS.ICE_RINK.outlineColour;
                        break;
                        case "SHRINK_HAZ":
                        fillColour = MODIFIER_COLOURS.SHRINK_HAZ.fillColour;
                        outlineColour = MODIFIER_COLOURS.SHRINK_HAZ.outlineColour;
                        break;
                        case "ENLARGE_HAZ":
                        fillColour = MODIFIER_COLOURS.ENLARGE_HAZ.fillColour;
                        outlineColour = MODIFIER_COLOURS.ENLARGE_HAZ.outlineColour;
                        break;
                        case "EXTRA_LIFE":
                        fillColour = MODIFIER_COLOURS.EXTRA_LIFE.fillColour;
                        outlineColour = MODIFIER_COLOURS.EXTRA_LIFE.outlineColour;
                        break;
                    }
                }
                // draw fill 
                this.ctx.beginPath();
                this.ctx.arc(entity.position.x, entity.position.y, entity.radius, 0, 2 * Math.PI);
                this.ctx.fillStyle = fillColour;
                this.ctx.fill();
                // draw outline
                this.ctx.lineWidth = ENTITY_OUTLINE_WIDTH;
                this.ctx.strokeStyle = outlineColour;
                this.ctx.stroke();

                renderData.splice(i, 1);
            }
        }
    }

    private renderHazards(renderData: RenderData[]): void {
        for (let i = renderData.length - 1; i >= 0; i--) {
            const entity = renderData[i];
            if (entity.type === "hazard") {
                let fillColour: string = "";
                let outlineColour: string = "";
                if (entity.flashOn) {
                    fillColour = COLLISION_COLOURS.fillColour;
                    outlineColour = COLLISION_COLOURS.outlineColour;
                } else {
                    fillColour = HAZARD_COLOURS.fillColour;
                    outlineColour = HAZARD_COLOURS.outlineColour;
                }
                // draw fill
                this.ctx.fillStyle = fillColour;
                this.ctx.fillRect(entity.position.x, entity.position.y, entity.size.width, entity.size.height);
                // draw outline
                this.ctx.strokeStyle = outlineColour;
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(entity.position.x, entity.position.y, entity.size.width, entity.size.height);
                
                renderData.splice(i, 1);
            }
        }
    }

    private renderPlayer(renderData: RenderData[]): void {
        for (let i = renderData.length - 1; i >= 0; i--) {
            const entity = renderData[i];
            if (entity.type === "player") {
                // determine colours based on player state
                let fillColour: string = "";
                let outlineColour: string = "";
                if (entity.flashOn) {
                    fillColour = COLLISION_COLOURS.fillColour;
                    outlineColour = COLLISION_COLOURS.outlineColour;
                } else {
                    outlineColour = PLAYER_COLOURS.outlineColour;
                    if (entity.invincible && !entity.wearOffColourOverride) {
                        fillColour = PLAYER_COLOURS.invincibilityColour;
                    } else if (entity.iceRink && !entity.wearOffColourOverride) {
                        fillColour = PLAYER_COLOURS.iceRinkColour;
                    } else if (entity.health >= 3) {
                        fillColour = PLAYER_COLOURS.health3Colour;
                    } else if (entity.health === 2) {
                        fillColour = PLAYER_COLOURS.health2Colour;
                    } else {
                        fillColour = PLAYER_COLOURS.health1Colour;
                    }
                }
                // draw fill
                this.ctx.fillStyle = fillColour;
                this.ctx.fillRect(entity.position.x, entity.position.y, entity.size.width, entity.size.height);
                // draw outline
                this.ctx.strokeStyle = outlineColour;
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(entity.position.x, entity.position.y, entity.size.width, entity.size.height);
                
                renderData.splice(i, 1);
            }
        }
    }
}