import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, signal, ViewChild } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-floating-bar',
  templateUrl: './floating-bar.html',
  styleUrl: './floating-bar.scss'
})
export class FloatingBar implements AfterViewInit, OnDestroy {

  @ViewChild('placeholder')
  private placeholder!: ElementRef<HTMLElement>;

  @ViewChild('conteudo')
  private conteudo!: ElementRef<HTMLElement>;

  protected readonly flutuante = signal(false);
  protected readonly altura = signal(0);
  protected readonly esquerda = signal(0);
  protected readonly largura = signal(0);
  protected readonly espacamentoVertical = 24;
  private readonly foraDaViewport = signal(false);

  private readonly _mode = signal<'viewport' | 'host' | 'off'>('host');
  @Input() public set mode(value: 'viewport' | 'host' | 'off') {
    if (value != this._mode()) {
      this._mode.set(value);
      this.atualizarEstadoFlutuante();
    }
  }
  public get mode(): 'viewport' | 'host' | 'off' {
    return this._mode();
  }

  private observadorVisibilidade: IntersectionObserver|null = null;
  private observadorTamanho: ResizeObserver|null = null;
  private readonly aoRolar = (): void => this.atualizarGeometria();

  public ngAfterViewInit(): void {
    const placeholder = this.placeholder.nativeElement;
    const conteudo = this.conteudo.nativeElement;

    this.atualizarGeometria();
    this.observadorVisibilidade = new IntersectionObserver(([entrada]) => {
      this.atualizarGeometria();
      this.foraDaViewport.set(!entrada.isIntersecting);
      this.atualizarEstadoFlutuante();
    });
    this.observadorVisibilidade.observe(placeholder);

    this.observadorTamanho = new ResizeObserver(() => {
      this.atualizarGeometria();
    });
    this.observadorTamanho.observe(placeholder);
    this.observadorTamanho.observe(conteudo);
    document.addEventListener('scroll', this.aoRolar, true);
  }

  @HostListener('window:resize')
  public aoRedimensionar(): void {
    this.atualizarGeometria();
  }

  public ngOnDestroy(): void {
    this.observadorVisibilidade?.disconnect();
    this.observadorTamanho?.disconnect();
    document.removeEventListener('scroll', this.aoRolar, true);
  }

  private atualizarGeometria(): void {
    if (!this.placeholder || !this.conteudo) {
      return;
    }

    const retanguloPlaceholder = this.placeholder.nativeElement.getBoundingClientRect();
    this.esquerda.set(retanguloPlaceholder.left);
    this.largura.set(retanguloPlaceholder.width);
    this.altura.set(this.conteudo.nativeElement.getBoundingClientRect().height);
  }

  private atualizarEstadoFlutuante(): void {
    this.flutuante.set(this.mode !== 'off' && this.foraDaViewport());
  }
}
