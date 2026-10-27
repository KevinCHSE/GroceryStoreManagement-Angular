import { Component, computed, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";


import { Products } from '../../Models/Products';
import { FormsModule } from "@angular/forms";
import { SearchProductPipe } from "../../Pipes/search-product-pipe";
import { ClientService } from "../../Service/client-service";
import { ProductService } from "../../Service/product-service";
import { InvoiceService } from "../../Service/invoice-service";
import { ProductImageService } from "../../Service/product-image-service";
import { CartItem } from "../../Models/carItem";
import { of, switchMap, throwError } from "rxjs";
import { invoiceRequest } from "../../Models/invoice/invoiceRequest";




@Component({
  selector:"ShoppingCar",
  templateUrl:'carrito.component.html',
  styleUrl:'carrito.component.css',
  imports: [FormsModule,SearchProductPipe]
})
export class CarritoComponent{

  serviceClient=inject(ClientService)
  serviceProduct=inject(ProductService)
  serviceInvoice=inject(InvoiceService)
  serviceImage=inject(ProductImageService)

  //Errors
  ErrorMessage=signal<string>("")


  //Client
  selectedClient = signal<string | null>(null);
  amount=signal<number>(1)

  //save Invoice
  selectedPayment=signal<string>("")

  invoiceItem=signal<CartItem[]>([])
  
  invoiceTotal = computed(() =>
  this.invoiceItem().reduce((sum, item) => sum + item.product.price * item.amount, 0)
);

  //searchProduct
  product=signal<string>("")


  //button addItem
  addItem(product:Products){
      if(!product)return;
      const items=this.invoiceItem();
      const exist= items.find(item=>item.product.id===product?.id)
      const inCar=exist?.amount ?? 0;

      if (inCar + this.amount() > product.stock) {
          this.ErrorMessage.set(`Solo hay ${product.stock} de ${product.name}`);
          return;
        }
        this.ErrorMessage.set("");
        this.invoiceItem.set(
          exist
            ? items.map(item => item.product.id === product.id
                ? { ...item, amount: item.amount + this.amount() } : item)
            : [...items, { product, amount: this.amount() } ]
        );
    }

    //buttond delete Item
    deleteItem(id: number): void {
    const items = this.invoiceItem();
    const item = items.find(item => item.product.id === id);

    if (!item) {
      return; // no está en el carrito, no hay nada que borrar
    }

    this.invoiceItem.set(items.filter(item => item.product.id !== id));
    }


  //Products and clients
    getClients=rxResource({
      stream:(args)=>{
        return this.serviceClient.getClients()
        .pipe(
          switchMap((result)=>result===null?throwError(()=>new Error("No se pudo conseguir a los clientes")):of(result))
        )
      }
    })

    getProducts=rxResource({
      stream:(args)=>{
        return this.serviceProduct.getProducts()
        .pipe(
          switchMap(result=>result===null?throwError(()=>new Error("Products are not found")):of(result))
        )
      }
    })

    protected productosActivos = computed(() =>
      (this.getProducts.value() ?? []).filter(p => p.active)
    );

    protected sinImagen = signal<ReadonlySet<number>>(new Set());

    protected marcarSinImagen(id: number): void {
      this.sinImagen.update(s => new Set(s).add(id));
    }

    //create invoice
    saveInvoice():void{

      if (!this.selectedClient() || this.invoiceItem().length === 0 || !this.selectedPayment()) {
    this.ErrorMessage.set("rellene todos los espacios");
    return;
  }

  const items = this.invoiceItem();

  const invoice: invoiceRequest = {
    clientId: this.selectedClient()!,
    payment: this.selectedPayment(),
    items: items.map(item => ({
      productId: item.product.id!,
      amount: item.amount
    }))
  }
    this.serviceInvoice.saveInvoice(invoice).subscribe({
      next: () => {
        this.selectedClient.set(null);
        this.invoiceItem.set([]);
        this.selectedPayment.set("");
        this.ErrorMessage.set("");
        this.getProducts.reload();
      },
      error: (err) => {
        this.ErrorMessage.set(err.error?.message ?? err.message);
      }
    });

    }
  }
