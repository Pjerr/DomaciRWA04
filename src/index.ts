import { fromEvent, from, Observable } from "../node_modules/rxjs/index";
import {
  debounceTime,
  map,
  filter,
  switchMap,
} from "../node_modules/rxjs/operators/index";
import { Product } from "./product";

const API_URL = "http://localhost:3000";

function getProductObservableByName(name:string):Observable<Product[]>{
  console.log(`fetching a product with name: ${name}`);
  return from(
    fetch(`${API_URL}/products/?name=${name}`)
      .then((response)=>{
        if(response.ok) return response.json();
        else throw new Error("fetch error");
    }).catch((er)=>console.log(er))
  );
}

function createProductSearchBoxByName()
{
  const label=document.createElement("label");
  label.innerHTML="Product name "
  document.body.appendChild(label);
  const input=document.createElement("input");
  document.body.appendChild(input);
  fromEvent(input,"input")
    .pipe(
      debounceTime(1000),
      map((ev:InputEvent)=>(<HTMLInputElement>ev.target).value),
      filter((text)=>text.length>=3),
      switchMap((name)=>getProductObservableByName(name)),
      map(products=>products[0])
    ).subscribe((product:Product)=>showProduct(product));
}

function getProductObservableByQuantity(value:number):Observable<Product[]>{
  console.log(`fetching products with quantity greater then ${value}`);
  return from(
    fetch(`${API_URL}/products/?quantity%3E${value}`)
      .then((response)=>{
        if(response.ok) return response.json();
        else throw new Error("fetch quantity error");
      }).catch((err)=> console.log(err))
  );
}

function createProductSearchBoxByQuantity(){
  let label=document.createElement("label");
  label.innerHTML="Quantity min ";
  document.body.appendChild(label);
  let input=document.createElement("input");
  input.setAttribute("type","number");
  document.body.appendChild(input);

  fromEvent(input,"input")
    .pipe(
      debounceTime(1000),
      map((ev:InputEvent)=>(<HTMLInputElement>ev.target).value),
      switchMap((value)=>getProductObservableByQuantity(+value)),
    ).subscribe((products:Product[])=>showProducts(products));
}

function showProduct(product:Product){
  if(!product) return;
  const div=document.createElement("div");
  div.innerHTML=`${product.id}, ${product.name}, ${product.quantity}, ${product.type}`;
  document.body.appendChild(div);
}

function showProducts(products:Product[]){
  if(!products) return;
  let div;
  products.forEach(product => {
    div=document.createElement("div");
    div.innerHTML=`${product.id}, ${product.name}, ${product.quantity}, ${product.type}`;
    document.body.appendChild(div);
  });
}

createProductSearchBoxByName();
createProductSearchBoxByQuantity();