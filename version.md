## Versiyon 1.9.0
- YENİ: Autocomplete tab select özelliği eklendi.

## Versiyon 1.8.0
- YENİ: Autocomplete yapılacak veri listesi için `data` şeklinde Javascript arrayi eklenebilir hale getirildi. `$(element).data('service', [array değeri])` şeklinde veri listesi ataması yapılabilir.

## Versiyon 1.7.0
- YENİ: Autocomplete plugin özelliklerini güncelleme eklendi.
- YENİ: `onUpdate` callbacki eklendi.
- DEĞİŞİKLİK: `bindActions` metod ismi diğer pluginlerdeki ortak yapıyı koruması için `bindUIActions` olarak değiştirildi.

## Versiyon 1.6.0
- YENİ: Ajax autocomplete işlemleri için `cache` opsiyonu eklendi. Arama yapılırken, bulunanan sonuçlar data olarak saklanıp, sorgu tekrar yapıldığında saklanan data gösterilebilir.
- YENİ: `$.uxautocomplete.clearCache(el)` metodu eklendi.
- YENİ: `onClearCache` callbacki eklendi.

## Versiyon 1.5.0
- YENİ: Autocomplete `autocompletesearch` ve `autocompleteresponse` eventleri için indikatör eklendi.
- YENİ: Plugin bindinglerini kaldırmak için `$.uxautocomplete.remove(el)` metodu eklendi.
- YENİ: uxRocket data kayıtları eklendi.
- YENİ: uxClear bağımlılığı kaldırıldı.
- DEĞİŞİKLİK: Statik olarak eklenmiş id/class isimleri parametrik hale getirildi.
- DEĞİŞİKLİK: Plugin eventleri `.uxAutocomplete` namespacei içine eklendi.

## Versiyon 1.4.6
- FIX: Tanımlamalardaki typo hataları düzeltildi.

## Versiyon 1.4.5
- DEĞİŞİKLİK: Selector optimizasyon

## Versiyon 1.4.4
- FIX: Seçim sırasında URL metodunun birden fazla çalışması düzeltildi.

## Versiyon 1.4.3
- FIX: arrowSelection sırasında `target` kontrolü düzeltildi.

## Versiyon 1.4.2
- FIX: setSource fonksiyonun tanımlanma şeklinden dolayı IE'de sayfa yüklemelerinde otomatik açılma problemi giderildi.

## Versiyon 1.4.1
- YENİ: Öneri listesinde oklarla hareket sırasında, fieldın güncellenip/güncellemeyeceği ile alakalı `arrowNavigation` kontrolü eklendi

## Versiyon 1.4.0
- YENİ: Öneri listesinde oklarla hareket edilip enterla seçim yapıldığında url yönlendirme seçeneği eklendi.

## Versiyon 1.3.0
- DEĞİŞİKLİK: Input elemanından wrapper üzerine class isimleri aktarılırken, "uxitd-autocomplete-ready" ve selector classı kaldırılmaya başlandı. 

## Versiyon 1.2.3
- FIX: Klavye ile autocomplete önerilerinde hareket ederken highlight görünümü eklendi.

## Versiyon 1.2.2
- FIX: jQuery 2 ile jQueryUI'ın `uiAutocomplete` data isminin `ui-autocomplete` olarak gelmeye başlaması nedeniyle bozulan kontrol metodu düzeltildi.

## Versiyon 1.2.1
- FIX: Class kontrolleri yüzünden, eklenecek eleman inputun kendisi mi yoksa değil mi kontrolü eklendi.

## Versiyon 1.2.0
- DEĞİŞİKLİK: Diğer pluginler ile uyumlu olması için `uxitd-autocomplete-holder` class ismi `uxitd-autocomplete-wrap` olarak değiştirildi.

## Versiyon 1.1.2
- DEĞİŞİKLİK: Input'un bütün CSS classları uxitd-plugin-wrap'a da eklenecek şekilde değiştirildi.
- DEĞİŞİKLİK: `.uxitd-autocomplete-holder` içinden `width: 100%;` tanımı kaldırıldı.

## Versiyon 1.1.1
- FIX: IE8 de hata veren, template tanımındaki _default_ propertysinin _list_ olarak değişirildi.

## Versiyon 1.1.0
- YENİ: Listelerdeki match eden elemanların highlight edilmesine imkan sağlamak için `{{{matched}}}` parametresi kaldırılıp, `highlight` seçimi eklendi.

## Versiyon 1.0.0
- YENİ: Autocomplete listesi için Handlebars template desteği eklendi.
- YENİ: Menu render sırasında overwrite edilen jQueryUI metodları, sadece instance için overwrite olacak şekilde yapılandırıldı.
- DEĞİŞİKLİK: Data source için kullanılacak JSON formatı menü data attribute değerleri ile eşleşecek şekilde revize edildi.
- FIX: Kategori görünümünde, kategori hover durumunda consoleda çıkan hata mesajları giderildi.
- FIX: Ajax servis modundayken item limitinin çalışmaması sorunu giderildi.