import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Toast } from '@components/atoms/toast/toast';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,Navbar,Toast],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {

}
