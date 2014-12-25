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