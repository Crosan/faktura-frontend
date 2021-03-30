
import { Profile } from './profile';
import { Faktura } from './faktura';
import { Type } from 'class-transformer';

/**
 * @module Model
 */

export class Parsing {

    id: number;
    data_fil: File
    mangel_liste_fil: any
    oprettet: Date
    oprettet_af: Profile // Dette er ikke i Django-db'en
    sent: Boolean
    // filename: string

    @Type(() => Faktura)
    fakturaer: Faktura[]

    flatten() {

        var return_obj: any = {
            id: this.id,
            data_fil: this.data_fil,
            mangel_liste_fil: this.mangel_liste_fil,
            oprettet: this.oprettet,
            oprettet_af: this.oprettet_af.id,
            fakturaer: []
        }

        if (this.fakturaer) {
            for (let faktura of this.fakturaer) {
                return_obj.fakturaer.push(faktura.id)
            }
        }

        return return_obj
    }

    // TODO: Få til at virke...
    get filename() {
        // return this.data_fil.slice(35, -22)
        // return this.data_fil.name.replace(/^.*[\\\/]/, '')

        // Filenames are: actual/file/path.xlsx_-_YYYYMMDDHHSS.xlsx
        // charsAtEnd = -22;
        return this.data_fil.slice(this.data_fil.name.lastIndexOf("/")+1, -22)
    }

}