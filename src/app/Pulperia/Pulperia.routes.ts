import { Routes } from '@angular/router';
import { inicioComponent } from './pages/inicio/inicio.component';
import { LayoutComponent } from './Layout/layout-component/layout-component';
import { adminGuard } from '../Security/auth-guards';
import { clientesComponent } from './pages/clientes/clientes.component';
import { productosComponent } from './pages/productos/productos.component';

import { AgregarProducto } from './pages/productos/agregar-producto/agregar-producto';
import { EditarProducto } from './pages/productos/editar-producto/editar-producto';
import { AgregarCliente } from './pages/clientes/agregar-cliente/agregar-cliente';
import { EditarCliente } from './pages/clientes/editar-cliente/editar-cliente';
import { PaymentReport } from './pages/payment-report/payment-report';
import { NewUser } from './pages/new-user/new-user';
import { CarritoComponent } from './pages/carrito/carrito.component';




export const Pulperia:Routes=[
  {
    path:"",
    component:LayoutComponent,
    children:[
      {
          path:"Inicio",
          component:inicioComponent,
          canActivate:[adminGuard]
        },
        {
          path:"Clients",
          component:clientesComponent
        },

        {
          path:"Products",
          component:productosComponent
        },
        {
          path:"shoppingCar",
          component:CarritoComponent
        },
        {
          path:"Products/agregarProducto",
          component:AgregarProducto
        },
        {
          path:"Products/editarProducto/:id",
          component:EditarProducto
        },
        {
          path:"Clients/AgregarCliente",
          component:AgregarCliente
        },{
          path:"Clients/editarClient/:id",
          component:EditarCliente
        },
        {
          path:"paymentReport",
          component:PaymentReport,
          canActivate:[adminGuard]
        },
        {
          path:"newUser",
          component:NewUser,
          canActivate:[adminGuard]
        },
        {
          path:"**",
          component:CarritoComponent
        },
    ]
  },

];

export default Pulperia;
