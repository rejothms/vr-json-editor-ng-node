import { Component, Renderer2, OnInit, ElementRef, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketConnectService } from '../../../socket-connect.service';
import { EventDispatcherService } from '../../../service/event-dispatcher.service';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss'

})
export class TextEditorComponent implements OnInit {
  private _fileData: any;
  @Input()
  set fileData(data) {
    this._fileData = data;
    this.clearSpan();
    setTimeout(() => {
      this.jsonViewx = [];
    this.splitJson(JSON.stringify(data), 0);
      this.initJson();
    }, 100);
   
  }
  get fileData(): any {
    return this._fileData;
  }

  @ViewChild('editablediv') editablediv!: ElementRef;
  private notificationSubscribe: Subscription = new Subscription();
  parsedJson: any;
  editableContent: string = "";
  constructor(private renderer: Renderer2, private el: ElementRef,
    public socket: SocketConnectService
  ) { }

  ngOnInit(): void {

    this.notificationSubscribe.add(EventDispatcherService.get(EventDispatcherService.ON_JSON_UPDATE).subscribe((notification) => {
      this.jsonViewx = [];
      this.splitJson(JSON.stringify(notification), 0)
      this.initJson();
    }));
  }

  initJson() {
    var objx = [
      {
        className: 'cover-br',
        el: `<span>{</span>`
      }
    ]
    this.jsonViewx.unshift(objx);
    var objx1 = [
      {
        className: 'cover-br',
        el: `<span>}</span>`
      }
    ]
    this.jsonViewx.push(objx1);
  }

  public jsonViewx: Array<any> = [];

  private splitJson(jsonString: string, idn: number) {
    const jsonObj = JSON.parse(jsonString);

    var keyIndex = 0;
    const allKeys = Object.keys(jsonObj);
    for (const key in jsonObj) {
      var renderObj: Array<any> = [];
      var ids = idn;
      var isLast;
      if (Object.prototype.hasOwnProperty.call(jsonObj, key)) {
        keyIndex++;
        isLast = false;
        if (keyIndex === allKeys.length) {
          isLast = true;
        }
        const element = jsonObj[key];
        ids++;
        if (typeof element === 'object') {
          if (Array.isArray(element)) {
            renderObj = [{
              el: this.createSpanEl({ type: 'array', prop: key, value: element, isLast })
            }]
            this.jsonViewx.push(renderObj);
          } else if (isNull(element)) {
            renderObj = [{
              el: this.createSpanEl({ type: 'alltypes', subtype: 'null', prop: key, value: element, isLast })
            }]
            this.jsonViewx.push(renderObj);
          } else if (isObject(element)) {
            const randomId = (Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000) * ids;
            renderObj = [
              {
                el: this.createSpanEl({ type: 'props', prop: key })
              },
              {
                className: randomId,
                el: this.createSpanEl({ type: 'braces', pos: "start" })
              }
            ]
            this.jsonViewx.push(renderObj);
            this.splitJson(JSON.stringify(element), randomId)
            renderObj = [
              {
                className: randomId,
                el: this.createSpanEl({ type: 'braces', pos: "end", isLast })
              }
            ]
            this.jsonViewx.push(renderObj);
          }
        } else {
          renderObj = [
            {
              el: this.createSpanEl({ type: 'alltypes', prop: key, value: element, isLast })
            }
          ]
          this.jsonViewx.push(renderObj);
        }
      }
    }

    function isObject(value: any): boolean {
      return value !== null && typeof value === 'object' && !Array.isArray(value);
    }
    function isNull(value: any): boolean {
      return value === null;
    }
  }
  createSpanEl(el: any) {
    if (el.type === 'props') {
      return `<span class="js-props">\"${el.prop}\"</span><span>:</span>`
    } else if (el.type === 'braces') {
      return `<span>${el.pos === 'start' ? '{' : el.isLast ? '}' : '},'}</span>`
    } else if (el.type === 'alltypes') {
      let isString = (typeof (el.value) === 'string');
      let typeclass = el.subtype ? el.subtype : typeof (el.value)
      return `<span class="js-props">\"${el.prop}\"</span><span>:</span><span class=${typeclass}>${isString ? '"' : ''}${el.value}${isString ? '"' : ''}${el.isLast ? '' : ','}</span>`
    } else if (el.type === 'array') {
      return `<span class="js-props">\"${el.prop}\"</span><span>:</span><span class="array">${JSON.stringify(el.value)}${el.isLast ? '' : ','}</span>`
    }
    return null;
  }
  handleFocusIn(id: any) {
    if (!id) return;
    const className = 'cls-' + id;
    const cssRules = `
      .${className} {
        display: inline;
        background-color: yellow;
      }
    `;
    const styleElement = document.createElement('style');
    styleElement.id = 'unq-d';
    styleElement.appendChild(document.createTextNode(cssRules));
    document.head.appendChild(styleElement);
  }

  handleFocusOut(id: any) {
    if (!id) return;
    const className = 'cls-' + id;
    const existingStyleElement = document.getElementById('unq-d');
    if (existingStyleElement) {
      existingStyleElement.parentNode?.removeChild(existingStyleElement);
    }
  }
  public jsonStatus: string = "";
  onContentChange() {
    // This method will be called whenever the content changes
    let divText = this.editablediv.nativeElement.textContent;
    try {
      let json = JSON.parse(divText);
      this.socket.sendJson(json);
      this.jsonStatus = "valid";

    } catch (error) {
      this.jsonStatus = "invalid";
    }

  }

  public download(filename: any) {
    let divText = this.editablediv.nativeElement.textContent;

    try {
      let data = JSON.parse(divText);
      const formattedJson = JSON.stringify(data, null, 2);
      const blob = new Blob([formattedJson], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('invalid json');
    }
  }
  public lastpublisher: string = "";
  lastpublished(data: any, filename: any) {
    let file = data.find((item: any)=>item.name === filename);
    if(file) {
      this.lastpublisher = file.user;
    } else {
      this.lastpublisher = "";
    }
  }

  clearSpan() {
    const divElement = this.editablediv.nativeElement;
    const spanElements = this.editablediv.nativeElement.querySelectorAll('span');

    spanElements.forEach((span: any) => {
      this.renderer.setProperty(span, 'innerHTML', '');
    });
  }



}








