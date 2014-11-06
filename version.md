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