/**
 * @module Model
 */

 export class Debitor {

    id: number;

    debitor_nr: string
    gruppe: string
    navn: string
    GLN_nummer: string

    flatten() {

        return {
            id: this.id,
            debitor_nr: this.debitor_nr,
            navn: this.navn,
            GLN_nummer: this.GLN_nummer
        }
    }
}