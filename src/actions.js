"use strict";

(function () {
    var imageGrid,
        imageData,
        totalNodes,
        itemsReturned,
        currentRowIndex,
        currentImageIndex,
        query,
        lightbox,
        loadingScreen,
        loadImageErrorScreen,
        lightboxImageCellContainer,
        lightboxImageCell,
        lightboxImage,
        caption,
        btnPrev,
        btnNext,
        btnSearch,
        btnMore,
        txtQuery,
        selectedImageSize,
        xhttp,
        slideshowBtnsEnabled = false,
        resizeTimeout,
        lightboxIsVisible = false;
    
    function enableSlideshowBtns () {
        btnPrev.className = "";
        btnNext.className = "";
        slideshowBtnsEnabled = true;
    }
    
    function disableSlideshowBtns () {
        btnPrev.className = "disabledBtn";
        btnNext.className = "disabledBtn";
        slideshowBtnsEnabled = false;
    }
    
    function setupLightbox(imageIndex, imageWidth, imageHeight) {
        //console.log("lightbox provided image dim: " + imageWidth + " x " + imageHeight)
        
        
        var windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
            newWidth,
            newHeight;
        
        //console.log("windowWidth x windowHeight = " + windowWidth + " x " + windowHeight);
        
        if (imageHeight > imageWidth) {
            //console.log("Vertical image");
            if (imageHeight + 22 > windowHeight) {
                //console.log("whoa, so tall!");
                newHeight = windowHeight - 2 * 10;
                newWidth = Math.round(newHeight * imageWidth / imageHeight);
                
                if (newWidth + 22 > windowWidth - 55 * 2) {
                    newWidth = windowWidth - 2 * 10 - 55 * 2;
                    newHeight = Math.round(newWidth * imageHeight / imageWidth);
                }
                
                lightboxImageCell.style.width = newWidth + "px";
                lightboxImageCell.style.height = newHeight + "px";
                
                caption.style.width = newWidth - 2 * 10 + "px";
                
            } else {
                //console.log("regular image");
                if (imageWidth + 22 > windowWidth - 55 * 2) {
                    newWidth = windowWidth - 2 * 10 - 55 * 2;
                    newHeight = Math.round(newWidth * imageHeight / imageWidth);
                    
                    lightboxImageCell.style.width = newWidth + "px";
                    lightboxImageCell.style.height = newHeight + "px";
                    caption.style.width = newWidth - 2 * 10 + "px";
                } else {
                    //console.log("imageWidth x imageHeight = " + imageWidth + " x " + imageHeight);
                    lightboxImageCell.style.width = imageWidth + "px";
                    lightboxImageCell.style.height = imageHeight + "px";
                    caption.style.width = imageWidth - 2 * 10 + "px";
                }
            }
            
        } else {
            //console.log("horizontal image")
            if (imageWidth + 22 > windowWidth - 55 * 2) {
                newWidth = windowWidth - 2 * 10 - 55 * 2;
                newHeight = Math.round(newWidth * imageHeight / imageWidth);
                
                //console.log("newWidth x new Height = " + newWidth + " x " + newHeight);
                
                if (newHeight + 22 > windowHeight) {
                    newHeight = windowHeight - 2 * 10;
                    newWidth = Math.round(newHeight * imageWidth / imageHeight);
                }
                
                lightboxImageCell.style.width = newWidth + "px";
                lightboxImageCell.style.height = newHeight + "px";
                
                caption.style.width = newWidth - 2 * 10 + "px";
            } else {
                //console.log("cow");
                if (imageHeight + 22 > windowHeight) {
                    //console.log("pie");
                    newHeight = windowHeight - 2 * 10;
                    newWidth = Math.round(newHeight * imageWidth / imageHeight);
                    
                    //console.log("newWidth x newHeight = " + newWidth + " x " + newHeight);
                    
                    lightboxImageCell.style.width = newWidth + "px";
                    lightboxImageCell.style.height = newHeight + "px";
                    caption.style.width = newWidth - 2 * 10 + "px";
                } else {
                    //console.log("pasture.");
                    lightboxImageCell.style.width = imageWidth + "px";
                    lightboxImageCell.style.height = imageHeight + "px";
                    caption.style.width = imageWidth - 2 * 10 + "px";
                }
            }
        }
    }
    
    function clickedThumbnail(evt) {
        var lightboxImageIsLoaded,
            lightboxImageLoadError,
            index,
            imageDatum;
        
        lightboxIsVisible = true;
        
        lightbox.style.display = "table";
        lightboxImageCellContainer.style.display = "none";
        loadingScreen.style.display = "table-cell";
        disableSlideshowBtns();
        
        index = parseInt(evt.currentTarget.id);
        imageDatum = imageData[index];
        currentImageIndex = index;
        //console.log("clickedThumbnail:  currentImageIndex = " + currentImageIndex);
        
        lightboxImageIsLoaded = function (evt) {
            lightboxImage.removeEventListener("load", lightboxImageIsLoaded);
            lightboxImage.addEventListener("error", lightboxImageLoadError);
            
            loadingScreen.style.display = "none";
            lightboxImageCellContainer.style.display = "table-cell";
            loadImageErrorScreen.style.display = "none";
            setupLightbox(index, imageDatum.width, imageDatum.height);
            enableSlideshowBtns();
        };
        lightboxImage.addEventListener("load", lightboxImageIsLoaded);
        
        lightboxImageLoadError = function (evt) {
            lightboxImage.removeEventListener("load", lightboxImageIsLoaded);
            lightboxImage.addEventListener("error", lightboxImageLoadError);
            
            loadingScreen.style.display = "none";
            loadImageErrorScreen.style.display = "table-cell";
            enableSlideshowBtns();
        };
        lightboxImage.addEventListener("error", lightboxImageLoadError);
        
        lightboxImage.src = imageDatum.url;
        lightboxImage.alt = imageDatum.title;
        caption.innerHTML = imageDatum.htmlTitle;
        
        evt.stopPropagation();
    }
    
    function enableInputBtns() {
        btnSearch.disabled = false;
        btnMore.disabled = false;
    }
    
    function buildThumbnailNode(index, imageDatum, targetImageRow) {
        var image,
            imageCell,
            dataObj = {
                url: imageDatum.link,
                alt: imageDatum.title,
                htmlTitle: imageDatum.htmlTitle,
                width: imageDatum.image.width,
                height: imageDatum.image.height,
                loaded: false
            };
        imageData.push(dataObj);
        
        image = document.createElement("img");
        image.className = "image";
        image.addEventListener("load", function (evt) {
            imageData[totalNodes + index].loaded = true;
            
            if (imageData.every(function (datum) { return datum.loaded; })) {
                totalNodes += itemsReturned;
                
                if(itemsReturned < 10) { //Presumably, if Google Images API returned less than 10 items (even though we've asked for 10), we've hit the end of the possible images
                    btnMore.style.display = "none";
                }
                enableInputBtns();
            }
        });
        image.src = imageDatum.image.thumbnailLink;

        imageCell = document.createElement("div");
        imageCell.className = "imageCell";
        imageCell.id = String(totalNodes + index);
        imageCell.appendChild(image);
        targetImageRow.appendChild(imageCell);

        imageCell.addEventListener("click", clickedThumbnail);
        
        dataObj.node = imageCell;
    }
    
    function handleXMLHttpRequest(evt) {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                var jsonObj,
                    newImageRow,
                    rootNode = document.getElementById("imageGrid"),
                    i,
                    len;


                try {
                    jsonObj = JSON.parse(xhttp.responseText);
                } catch (e) {
                    if (typeof e === SyntaxError) {
                        console.log("ERROR:  Malformed JSON; BAD GOOGLE!");
                        alert("ERROR:  Malformed JSON; BAD GOOGLE!");
                    } else {
                        console.log("ERROR:  unknown error");
                        alert("ERROR:  unknown error");
                    }
                }

                newImageRow = document.createElement("div");
                newImageRow.className = "imageRow";
                newImageRow.id = "row" + currentRowIndex;
                rootNode.appendChild(newImageRow);

                for(i = 0, len = jsonObj.items.length; i < len; i++) {
                    buildThumbnailNode(i, jsonObj.items[i], newImageRow);
                }
                itemsReturned = jsonObj.items.length;

            } else {
                console.error("ERROR:  " + xhttp.statusText);
                alert("ERROR:  " + xhttp.statusText);
            }
        }
    }
    
    function loadDoc() {
        var params = {},
            paramStr,
            prop;
        
        //console.log("loadDoc:  selectedImageSize = " + selectedImageSize);
        
        params.q = query; // search text
        params.num = 10; // integer value range between 1 to 10 including
        params.start = totalNodes + 1; // integer value range between 1 to 101, it is like the offset
        params.imgSize = selectedImageSize; // for image size
        params.searchType = "image"; // compulsory 
        params.key = "AIzaSyD6O2lmedIhV5v905oMpoRfgIns5Hpc9Rs"; // API_KEY got from https://console.developers.google.com/
        params.cx = "014247353093954254332:_ax3nagvpek"; // cx value is the custom search engine value got from https://cse.google.com/cse(if not created then create it).

        paramStr = "";

        for (prop in params) {
            if (paramStr === "") {
                paramStr += prop + "=" + escape(params[prop]);
            } else {
                paramStr += "&" + prop + "=" + escape(params[prop]);
            }
        }
        
        xhttp = new XMLHttpRequest();
        xhttp.addEventListener("readystatechange", handleXMLHttpRequest);
        xhttp.open("GET", "https://www.googleapis.com/customsearch/v1?" + paramStr, true);
        xhttp.send();
    }
    
    function gotoSelectedImage() {
        var imageDatum,
            imageIsLoaded,
            imageLoadError;
        
        disableSlideshowBtns();
        lightboxImageCellContainer.style.display = "none";
        loadImageErrorScreen.style.display = "none";
        loadingScreen.style.display = "table-cell";
        
        imageDatum = imageData[currentImageIndex];
        
        imageIsLoaded = function (evt) {
            lightboxImage.removeEventListener("load", imageIsLoaded);
            lightboxImage.removeEventListener("error", imageLoadError);
            
            loadingScreen.style.display = "none";
            lightboxImageCellContainer.style.display = "table-cell";
            loadImageErrorScreen.style.display = "none";
            setupLightbox(currentImageIndex, imageDatum.width, imageDatum.height);
            enableSlideshowBtns();
            
            //console.log("gotoPrevImage:  currentImageIndex = " + currentImageIndex);
        };
        lightboxImage.addEventListener("load", imageIsLoaded);
        
        imageLoadError = function (evt) {
            lightboxImage.removeEventListener("load", imageIsLoaded);
            lightboxImage.removeEventListener("error", imageLoadError);
            
            lightboxImageCellContainer.style.display = "none";
            loadingScreen.style.display = "none";
            loadImageErrorScreen.style.display = "table-cell";
            enableSlideshowBtns();
            
            //console.log("gotoPrevImage:  currentImageIndex = " + currentImageIndex);
        };
        lightboxImage.addEventListener("error", imageLoadError);
        lightboxImage.src = imageDatum.url;
        lightboxImage.alt = imageDatum.title;
        caption.innerHTML = imageDatum.htmlTitle;
    }
    
    function gotoPrevImage(evt) {
        var prevImageIndex;
        
        if(!slideshowBtnsEnabled) {
            evt.stopPropagation();
            return ;
        }
        
        prevImageIndex = currentImageIndex - 1;
        if (prevImageIndex <= -1) {
            prevImageIndex = imageData.length - 1;
        }
        currentImageIndex = prevImageIndex;
        
        gotoSelectedImage();
        evt.stopPropagation();
    }
    
    function gotoNextImage(evt) {
        var nextImageIndex;
        
        if(!slideshowBtnsEnabled) {
            evt.stopPropagation();
            return ;
        }
        
        nextImageIndex = currentImageIndex + 1;
        if (nextImageIndex >= imageData.length) {
            nextImageIndex = 0;
        }
        currentImageIndex = nextImageIndex;
        
        gotoSelectedImage();
        evt.stopPropagation();
    }
    
    function clearImageGrid(doAfter) {
        var imageCells,
            imageRows;
        
        imageCells = document.getElementsByClassName("imageCell");
        [].forEach.call(imageCells, function (node, index, array) {
            node.removeEventListener("click", clickedThumbnail);
            node.parentElement.removeChild(node);
        });
        
        imageRows = document.getElementsByClassName("imageRow");
        [].forEach.call(imageRows, function (node, index, array) {
            node.parentElement.removeChild(node);
        });
        
        imageData = [];
        totalNodes = 0;
        currentRowIndex = 0;
        
        imageGrid.innerHTML = "";
        doAfter();
    }
    
    function disableInputBtns() {
        btnSearch.disabled = true;
        btnMore.disabled = true;
    }
    
    function getChosenImageSize() {
        var newImageSize,
            imgSizes = document.getElementsByName("imgSize");
        [].forEach.call(imgSizes, function (node, index, array) {
            if(node.checked) {
                //console.log("You chose " + node.value);
                newImageSize = node.value;
            }
        });
        return newImageSize;
    }
    
    function getMoreImages() {
        var newQuery = txtQuery.value;
        var newImageSize = getChosenImageSize();
        if (newQuery === "" || newQuery === null || newQuery === undefined) {
            txtQuery.value = "Please type a search term";
            return;
        }
        
        disableInputBtns();
        
        if (newQuery === query && newImageSize === selectedImageSize) {
            currentRowIndex++;
            if (currentRowIndex === 9) {  // We can only call the Google API 10 times in a row before it won't return anymore image hits.
                btnMore.style.display = "none";
            }
            loadDoc();
        } else {
            query = newQuery;
            selectedImageSize = newImageSize;
            
            //console.log("getMoreImages:  selectedImageSize = " + selectedImageSize);
            clearImageGrid(loadDoc);
        }
    }
    
    function performNewSearch() {
        var newQuery = txtQuery.value;
        if (newQuery === "" || newQuery === null || newQuery === undefined) {
            txtQuery.value = "Please type a search term";
            return;
        }
        query = newQuery;
        selectedImageSize = getChosenImageSize();
        //console.log("performNewSearch:  selectedImageSize = " + selectedImageSize);
        
        disableInputBtns();
        
        btnMore.style.display = "inline";
        
        clearImageGrid(loadDoc);
    }
    
    function closeLightbox(evt) {
        lightboxIsVisible = false;
        lightbox.style.display = "none";
        evt.stopPropagation();
    }
    
    function handleResizeEvent(evt) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            if(lightboxIsVisible) {
                setupLightbox(currentImageIndex, imageData[currentImageIndex].width, imageData[currentImageIndex].height);
            }
        }, 400);
    }
    
    function addListeners() {
        btnSearch.addEventListener("click", performNewSearch);
        btnMore.addEventListener("click", getMoreImages);
        
        btnPrev.addEventListener("click", gotoPrevImage);
        btnNext.addEventListener("click", gotoNextImage);
        
        lightbox.addEventListener("click", closeLightbox);
        lightboxImageCell.addEventListener("mouseenter", function (evt) {
            caption.style.display = "block";
        });
        lightboxImageCell.addEventListener("mouseleave", function (evt) {
            caption.style.display = "none";
        });
        
        txtQuery.addEventListener("focus", function (evt) {
            txtQuery.value = "";
        });
        
        window.addEventListener("resize", handleResizeEvent);
    }
    
    function setupVariables() {
        imageGrid = document.getElementById("imageGrid");
        
        loadingScreen = document.getElementById("loadingScreen");
        loadImageErrorScreen = document.getElementById("loadImageErrorScreen");
        
        lightbox = document.getElementById("lightbox");
        lightboxImageCellContainer = document.getElementById("lightboxRow");
        lightboxImageCell = document.getElementById("lightboxImageCell");
        lightboxImage = document.getElementById("lightboxImage");
        caption = document.getElementById("caption");
        
        btnPrev = document.getElementById("btnPrev");
        btnNext = document.getElementById("btnNext");
        btnSearch = document.getElementById("btnSearch");
        btnMore = document.getElementById("btnMore")
        
        txtQuery = document.getElementById("txtQuery");
    }
    
    function windowIsLoaded() {
        setupVariables();
        addListeners();
    }
    
    window.addEventListener("load", windowIsLoaded);
})();
