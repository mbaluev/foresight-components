/**
 * Created by mikhailbaluev on 03.07.17.
 */

function get(url, i){
    if (typeof(i)==="undefined") { i=0; }
    return new Promise(function(resolve, reject){
        $.get(url, null, function(res){
            resolve(res);
        }).fail(function(){
            if (i < 5) {
                i++;
                console.log(i);
                get(url,i)
                    .then(res => console.log(res))
                    .catch(err => console.error(err));
            } else {
                reject("Ошибка");
            }
        });
    })
}

get("http://qwe")
    .then(res => console.log(res))
    .catch(err => console.error(err));