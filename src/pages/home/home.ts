import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api';
import { DetailPostPage } from '../detail-post/detail-post';
import { SearchPage } from '../search/search';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    slides: any = []
    posts: any = []
    page: number = 1
    infiniteScroll: boolean = true
    offset = 100
    constructor(public navCtrl: NavController, private api: ApiProvider, private loadingCtrl: LoadingController) {
        
    }
    
    ionViewDidLoad() {
        let loader = this.loadingCtrl.create()
        loader.present()
        // list slider
        this.api.getBeritaUtama(this.page).subscribe(data => {
            loader.dismiss()
            for (let i = 0; i < data.length; i++) {
                let image
                if (data[i]['_embedded']['wp:featuredmedia'] != undefined) {
                    image = data[i]['_embedded']['wp:featuredmedia'][0].source_url
                } else {
                    image = 'assets/imgs/not-available.jpg'
                }
                this.slides.push({
                    title: data[i].title.rendered,
                    excerpt: data[i].excerpt.rendered,
                    date: data[i].date,
                    image: image,
                    content: data[i].content
                })
            }
        }, error => console.log(error))
        // list post
        this.api.getPost(this.page).subscribe(data => {
            loader.dismiss()
            for (let i = 0; i < data.length; i++) {
                let image
                if (data[i]['_embedded']['wp:featuredmedia'] != undefined) {
                    image = data[i]['_embedded']['wp:featuredmedia'][0].source_url
                } else {
                    image = 'assets/imgs/not-available.jpg'
                }
                this.posts.push({
                    title: data[i].title.rendered,
                    excerpt: data[i].excerpt.rendered,
                    date: data[i].date,
                    image: image,
                    content: data[i].content
                })
            }
        }, error => console.log(error))
    }
    
    doInfinite(infiniteScroll) {
        this.page += 1
        this.api.getPost(this.page).subscribe(data => {
            for (let i = 0; i < data.length; i++) {
                let image
                if (data[i]['_embedded']['wp:featuredmedia'] != undefined) {
                    image = data[i]['_embedded']['wp:featuredmedia'][0].source_url
                } else {
                    image = 'assets/imgs/not-available.jpg'
                }
                this.posts.push({
                    title: data[i].title.rendered,
                    excerpt: data[i].excerpt.rendered,
                    date: data[i].date,
                    image: image,
                    content: data[i].content
                })
            }
            infiniteScroll.complete();
        }, error => console.log(error))
    }

    toDetail(index) {
        this.navCtrl.push(DetailPostPage, {content: this.posts[index]})
    }

    keDetail(index) {
        this.navCtrl.push(DetailPostPage, {content: this.slides[index]})
    }

    showSearch() {
        this.navCtrl.push(SearchPage)
    }
    
}