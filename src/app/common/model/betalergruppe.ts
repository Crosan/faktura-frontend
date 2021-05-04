import { Rekvirent } from './rekvirent';

/**
 * @module Model
 */

export class Betalergruppe {

    id: number;

    navn: string
    oprettet: Date
    bgtype: string
    sum_total?: number;
    antal?: number;
    
    rekvirenter: Rekvirent[]


    flatten() {

        var return_obj: any = {
            id: this.id,
            navn: this.navn,
            oprettet: this.oprettet,
            bgtype: this.bgtype,
            sum_total: this.sum_total,
            antal: this.antal,
            rekvirenter: []
        }

        if (this.rekvirenter) {
            for (let rekvirent of this.rekvirenter) {
                return_obj.rekvirenter.push(rekvirent.id)
            }
        }

        return return_obj
    }
}