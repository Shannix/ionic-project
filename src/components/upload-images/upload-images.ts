import { Camera, CameraOptions } from '@ionic-native/camera';
import { Component, Input } from '@angular/core';
import { TodoList, ImageItem } from '../../models/model'
import { storage } from 'firebase';
import { TodoServiceProvider } from '../../providers/todo-service/todo-service'

@Component({
  selector: 'upload-images',
  templateUrl: 'upload-images.html'
})
export class UploadImagesComponent {

  @Input() item: TodoList;
  @Input() imageTitle: string = "no_name";

  constructor(
    private camera: Camera,
    private service: TodoServiceProvider,
  ) { }

  newImage(title, bucketLocation, urlLocation): ImageItem {
    const image: ImageItem = {
      bucketLocation: bucketLocation,
      urlLocation: urlLocation,
      title: title,
    };

    return image;
  }

  async takePhoto() {
    try {
      const options: CameraOptions = {
        quality: 50,
        targetHeight: 600,
        targetWidth: 600,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
      }

      const result = await this.camera.getPicture(options);

      const image = `data:image/jpeg;base64,${result}`;

      const bucketLocation = `pictures/${this.item.uuid}/${this.imageTitle}`;

      const pictures = storage().ref(bucketLocation);

      let url;
      await pictures.putString(image, 'data_url').then(function(snapshot) {
        url = snapshot.downloadURL;
      });

      this.service.addImageToTodoList(
        this.item,
        this.newImage(this.imageTitle, bucketLocation, url)
      );
    } catch (e) {
      console.error(e);
    }
  }
}