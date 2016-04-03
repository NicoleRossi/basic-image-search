How It Works
=======
When index.html loads, you will see a text input, a set of radio buttons, and a button.
  * Use the text box to enter an image search term.
  * Set the size of the images you wish to see with the radio buttons; the default is "large".
  * Click the "New Search" button to perform a Google Image search with your search term and chosen image size.

The Google Search API returns 10 image hits maximum, 10 calls maximum. Their thumbnails are displayed in a row under the "New Search" button; a "More Images?" button now appears. Click the "More Images?" button to retrieve another row of 10 images. If you change your search term or image-size selection and click "More Images?", the image grid vanishes and a new search is triggered. Clicking "New Search" will clear the image grid automatically and perform a new search, regardless of whether the search term or image-size selection has changed.  If the Google Search API does not return status "200", an alert displays the status text and logs it to the console.

Clicking on a thumbnail will trigger a lightbox with next and previous buttons to scroll through the image hits. If the image is smaller than the window size, it will be displayed at full resolution; if the image is larger than the window, it will be scaled down proportionally to fill either the window height or window width as appropriate. As the image loads, a loading graphic is shown. If an image cannot be loaded (e.g. due to secure vs. insecure domain issues), an error message is shown. The previous button will load the previous image into the lightbox; the next button will load the next image into the lightbox. (Images are indexed left-to-right in each row; when the end of a row is reached, indexing resumes at the beginning of the next row downward.) If the last image is reached, the next image is the leftmost image in the topmost row. If the first image is reached, the previous image is the rightmost image in the bottommost row. Mousing over the image will show the HTML caption; rolling out of the image will hide the HTML caption. Clicking the grey background or the image will close the lightbox.

Random Notes
=======
  * The desktop page is fully responsive.
