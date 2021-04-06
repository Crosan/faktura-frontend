import { AnalyseType } from './analyse-type';
import { Faktura } from './faktura';
import { Betalergruppe } from './betalergruppe'

/**
 * @module Model
 */

export class Rekvirent {

    id: number;

    // hospital: string
    niveau: string
    afdelingsnavn: string
    GLN_nummer: string
    betalergruppe: Betalergruppe

    fakturaer: Faktura[]

    flatten() {

        var return_obj: any = {
            id: this.id,
            // hospital: this.hospital,
            niveau: this.niveau,
            afdelingsnavn: this.afdelingsnavn,
            GLN_nummer: this.GLN_nummer,
            betalergruppe: this.betalergruppe,
            fakturaer: []
        }

        if (this.fakturaer) {
            for (let faktura of this.fakturaer) {
                return_obj.fakturaer.push(faktura.id)
            }
        }

        return return_obj
    }
}