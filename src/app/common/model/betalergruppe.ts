import { Rekvirent } from './rekvirent';

/**
 * @module Model
 */

export class Betalergruppe {

    id: number;

    navn: string
    oprettet: Date
    
    rekvirenter: Rekvirent[]


    flatten() {

        var return_obj: any = {
            id: this.id,
            navn: this.navn,
            oprettet: this.oprettet,
            rekvirenter: []
        }

        // Kan vi gøre noget smartere end det her?
        if (this.rekvirenter) {
            for (let rekvirent of this.rekvirenter) {
                return_obj.rekvirenter.push(rekvirent.id)
            }
        }

        return return_obj
    }
}