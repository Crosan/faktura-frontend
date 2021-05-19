import { AnalyseType } from './analyse-type';
import { Faktura } from './faktura';
import { Betalergruppe } from './betalergruppe'
import { StringifyOptions } from 'querystring';

/**
 * @module Model
 */

export class Rekvirent {

    id: number;

    // hospital: string
    niveau: string
    // afdelingsnavn: string
    shortname: string
    GLN_nummer: string
    rekv_nr: string
    betalergruppe: Betalergruppe
    debitor_nr: string

    fakturaer: Faktura[]

    flatten() {

        var return_obj: any = {
            id: this.id,
            // hospital: this.hospital,
            niveau: this.niveau,
            afdelingsnavn: this.shortname,
            GLN_nummer: this.GLN_nummer,
            rekv_nr: this.rekv_nr,
            betalergruppe: this.betalergruppe,
            debitor_nr: this.debitor_nr,
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