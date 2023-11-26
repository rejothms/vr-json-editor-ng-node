import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventDispatcherService {
  private static _emitters: { [ID: string]: EventEmitter<any> } = {};
  


  public static readonly ON_JSON_UPDATE: string = "on_json_update";
  public static readonly ON_JSON_PUBLISHED_BY: string = "on_json_published_by";
  /**
   * Returns instance for specific event name
   * One instance each for each event name
   */
  static get(ID: string): EventEmitter<any> {
    if (!this._emitters[ID]) {
      this._emitters[ID] = new EventEmitter();
    }
    return this._emitters[ID];
  }
  constructor() { }

}
