import {AfterContentInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {BotApi} from '../botapi';
import {switchMap} from 'rxjs/operators';
import {Mode, TradeDetailMode, TradeDetails} from '../trade-details';
import {Observable} from 'rxjs';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-trade-details',
  templateUrl: './trade-details.component.html',
  styleUrls: ['./trade-details.component.css']
})
export class TradeDetailsComponent implements OnInit {
  private tradeDetailMode = TradeDetailMode;
  @ViewChild('modal_template') template: ElementRef;

  // trade$: Observable<TradeDetails>;
  trade: TradeDetails;
  // editMode: boolean;
  mode: Mode;
  // trade: TradeDetails;

  private modalRef: BsModalRef;

  private config = {
    class: 'modal-lg',
    keyboard: false,
    ignoreBackdropClick: true
  }

  constructor( private modalService: BsModalService,
               private route: ActivatedRoute,
               private changeDetector: ChangeDetectorRef,
               private router: Router,
               private location: Location,
               private api: BotApi) {

    this.route.paramMap.subscribe(params => this.mode = new Mode(<TradeDetailMode>params.get('mode')));
  }

  ngOnInit() {
    setTimeout(this.init.bind(this), 0);
    // this.router.
    // console.log(this.location.path());
  }

  private init() {
    // if (this.mode.isCreate()) {
    //   this.trade$ = new TradeDetails();
    // } else {
    //   this.trade$ = this.route.paramMap.pipe(
    //     switchMap(params => {
    //       return this.api.getActiveTradeInfo(params.get('id'));
    //     })
    //   );
    // }

    if (this.mode.isCreate()) {
      this.trade = new TradeDetails(true);
    } else {
      this.route.paramMap.pipe(
        switchMap(params => {
          return this.api.getActiveTradeInfo(params.get('id'));
        })
      ).subscribe(trade => this.trade = trade);
    }
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  confirm() {
    this.closeModal();
  }

  decline() {
    this.closeModal();
  }

  closeModal() {
    this.modalRef.hide();
    this.router.navigate(['/trades']);
  }
}
