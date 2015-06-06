UX Rocket Autocomplete
=====================
Autocomplete plugini, jQueryUI Autocomplete altyapısı kullanılarak geliştirilmiştir. Orjinal plugindeki özelliklerin tamamı kullanılabilir. Ayrıca, autocomplete olarak çalışacak alanlarda `data` tanımları ile de ayarlar değiştirilebilir.

```HTML
<input type="text" class="auto-complete" />
<input type="text" class="auto-complete" data-type="image" />
<input type="text" class="auto-complete" data-type="category" />
<input type="text" class="auto-complete" data-type="tree" />
<input type="text" class="auto-complete" data-service="dataSource" />
```

```JSON
{
    "itemList":[
        {
            "category":"A",
            "image":"image-01.jpg",
            "name":"Asp",
            "value": "A, Asp",
            "title": "Web Language",
            "id":"03",
            "url": "http://www.example.com"
        },
        {
            "category":"B",
            "image":"image-02.jpg",
            "name":"Basic",
            "value":"B, Basic",
            "title": "Desktop Language",
            "id":"04",
            "url": "http://www.sample.com"
        }
    ]
}
```

### Örnek HandleBars Teması
```JavaScript
var customList = {
                     wrap: '<ul></ul>',
                     item: '<li>' +
                             '<a {{#if url}}href="{{url}}"{{/if}}>' +
                                 '{{{name}}}' +
                                 '{{#if title}}' +
                                     '<br /><em>{{substr title 50}}</em>' +
                                 '{{/if}}' +
                             '</a>' +
                           '</li>'
                 }
```

### Notlar
Metin girişi sırası çıkan listede `data-type` değerine göre farklı görünümler oluşturulabilir. Ön tanımlı temalara göre `data-type` değerleri aşağıdaki gibi olabilir;

* `list`, sadece metin olan liste görünümü
* `image`, metin ve resimden oluşan liste görünümü
* `category`, kategorilere bölünmüş liste görünümü
* `tree`, kategorilere bölünmüş resimli liste görünümü

Autocomplete pluginin sonuçları alacağı örnek json çıktısı yukarıdaki gibi olmalıdır. Servis'e bağlanılacak durumlarda __Servis URL__'i, JSON Objesi kullanılacak durumlarda __Objenin Adı__ `service` değeri olarak tanımlanmalıdır. Gönderilen `data-type` değerine göre, listedeki ögeler için `category`, `image` alanları gönderilmeyebilir ya da boş gönderilebilir.

Seçim yapıldıktan sonra, metin alanına eklenecek metin, data içindeki __`value`__ değeri ile tanımlanır. Kullanım ihtiyacınıza göre bu değeri, listedeki değerden farklı olarak tanımlayabilirsiniz. Tanımlanmadığı durumlarda, __`name`__ değer kullanılmaktadır.


### Tanımlar
Property			 | Default			    | Açıklama
-------------------- | -------------------- | --------
type                 | list                 | Autocomplete seçeneklerinin çıkacağı liste görünümünü belirler. "list", "image", "category" ve "tree" değerlerini alabilir.
service              | null                 | Metin alanında yapılan sorgunun yapılıp sonuçların alınacağı data setidir. Ajax sorgusu yapılacak bir __Servis URL__'i ya da sayfa içerisindeki bir __JSON Objesi__ olabilir.
item                 | 10                   | Listede çıkacak maksimum seçenek sayısını belirler.
minLength            | 2                    | En az kaç karakterden sonra listenin görünür olacağını belirler.
formdata             | null                 | Servis Ajax ile çağrılacağında, ihtiyaç halinde `serialize()` edilerek gönderilecek formun seçicisini belirler
queryType            | GET                  | Server'a göndereceğiniz sorgunun tipini belirler. GET veya POST olarak 2 değer alabilir.
characterTextLimit   | 20                   | Kategori'li tipi kullanıyorsanız, kategori text'inin kısaltmaya yöneliktir.
hidden               | null                 | Listeden seçim yapıldığında, seçimin idsi farklı bir alana eklenecekse, liste ile ilgili alanı css id ya da css classına göre ilişkilendirir.
template             | null                 | Listenin görünümü ön tanımlı varyasyonlar dışında olacaksa, yeni görünüm için kullanılacak __Handlebars__ template objesidir.
highlight            | true                 | Listelerde match eden karakterlere highlight özelliğini ekler.
arrowSelection       | false                | Listelerde ok tuşları ile hareket ettikten sonra `enter` tuşuna basarak sonucun seçilip seçilmeyeceğini belirtir.
arrowNavigation      | true                 | Listelerde ok tuşları ile hareket ederken satırın highlight olup olmayacağını belirtir.
cache                | false                | Ajax sorgusu yapılan aramalarda sonuçların ön belleğe kaydedilip kaydedilmeyeceğiniz belirtir.


Data Attribute			   | &nbsp;
-------------------------- | -----
type                       | Autocomplete seçeneklerinin çıkacağı liste görünümünü belirler. "list", "image", "category" ve "tree" değerlerini alabilir.
service                    | Metin alanına girilen içeriğe göre sorgunun sonuçlarının alınacağı data setidir.
item                       | Listede çıkacak maksimum seçenek sayısını belirler.
min-length                 | En az kaç karakterden sonra listenin görünür olacağını belirler.
formdata                   | Servis Ajax ile çağrılacağında, ihtiyaç halinde `serialize()` edilerek gönderilecek formun seçicisini belirler
query-type                 | Server'a göndereceğiniz sorgunun tipini belirler. GET veya POST olarak 2 değer alabilir.
props                      | Metin alanının yanındaki büyüteç ikonuna tıklandığında çalışacak fonksiyonu çağırır.
hidden                     | Listeden seçim yapıldığında, seçimin idsi farklı bir alana eklenecekse, liste ile ilgili alanı css id ya da css classına göre ilişkilendirir.
character-text-limit       | Kategori'li tipi kullanıyorsanız, kategori text'inin kısaltmaya yöneliktir.
template                   | Listenin görünümü ön tanımlı varyasyonlar dışında olacaksa, yeni görünüm için kullanılacak __Handlebars__ template objesidir.
highlight                  | Listelerde match eden karakterlere highlight özelliğini ekler.
arrow-selection            | Listelerde ok tuşları ile hareket ettikten sonra `enter` tuşuna basarak sonucun seçilip seçilmeyeceğini belirtir.
arrow-navigation           | Listelerde ok tuşları ile hareket ederken satırın highlight olup olmayacağını belirtir.
cache                      | Ajax sorgusu yapılan aramalarda sonuçların ön belleğe kaydedilip kaydedilmeyeceğiniz belirtir.


Callback			 | &nbsp;
-------------------- | -----
onReady              | Autocomplete, form elemanına bağlandığında çalışacak fonksiyonu çağırır.
onSelect             | Listeden seçim yapıldığında, çalışacak fonksiyonu çağırır.
onButtonClick        | Metin alanının yanındaki büyüteç ikonuna tıklandığında çalışacak fonksiyonu çağırır.
onClearCache         | Elemana eklenmiş ajax arama sonuçları ön belleği silindiğinde çalışacak fonksiyonu çağırır.
onRemove             | Eleman üzerinden Autocomplete kaldırıldığında çalışacak fonksiyonu çağırır.


### Public Metodlar
Method					  			   | Açıklama
-------------------------------------- | -------------------------------------------------------
$(selector).uxitdautocomplete(options) | Bu method plugini manuel olarak bir elemana bağlamanızı sağlar.
$.uxautocomplete                       | Bu method pluginin detayını görmenizi sağlar
$.uxautocomplete.version               | Sayfaya eklenmiş pluginin versiyon numarasını gösterir.
$.uxautocomplete.settings              | Aktif pluginin ayarlarını gösterir.
$.uxautocomplete.clearCache(el)        | Belirtilen elemanın ön belleğini siler. `el` değeri boş gönderilirse, sayfadaki bütün Autocomplete elemanlarındaki ön belleği siler.
$.uxautocomplete.remove(el)            | Elemanın üzerinden Autocomplete özelliğini kaldırır. `el` değeri boş gönderilirse, sayfadaki bütün Autocomplete elemanlarındaki bu özelliği kaldırır.