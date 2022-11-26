---
layout: "../../layouts/BlogPost.astro"
title: "چطور عدد های انگلیسی رو به فارسی تبدیل کنیم؟"
description: ""
pubDate: "Nov 26 2022"
---

احتمالا تا حالا براتون پیش اومده باشه که یه عدد انگلیسی دارید و میخواید توی سایتتون به فارسی نشونش بدید. فرض کنید این رو از api گرفتید:

<div dir="ltr">

```js
{ "age": 12 }
```

</div>
و میخواید age رو به فارسی (۱۲، نه 12) نشون بدید. من همینجوری یه سرچ تو اینترنت کردم تا ببینم بقیه چیکار میکنند. بیشتر با راه حل هایی شبیه به این مواجه شدم:
<div dir="ltr">

```js
function toFarsiNumber(num) {
  const farsi = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(num).replace(/[0-9]/g, function (w) {
    return farsi[+w];
  });
}
```

</div>

یا

<div dir="ltr">

```js
function toFarsiNumber2(number) {
  const farsi = {
    0: "۰",
    1: "۱",
    2: "۲",
    3: "۳",
    4: "۴",
    5: "۵",
    6: "۶",
    7: "۷",
    8: "۸",
    9: "۹",
  };
  number = number.toString().split("");
  let persianNumber = "";
  for (let i = 0; i < number.length; i++) {
    number[i] = farsi[number[i]];
  }
  for (let i = 0; i < number.length; i++) {
    persianNumber += number[i];
  }
  return persianNumber;
}
```

</div>

و ایده همه این راه حل ها هم اینه که اول عدد رو به string تبدیل میکنند و بعد دنبال عدد های انگلیسی میگردند تا با فارسی جایگزینش کنند. خیلی هم خوب کار میکنه ولی برام عجیب بود که هیچکس از Intl صحبت نمیکنه. جاوااسکریپت یه آبجکت به اسم Intl داره که دقیقا همین کار رو میتونه انجام بده!

<div dir="ltr">

```js
function toFarsiNumber3(num) {
  return new Intl.NumberFormat("fa").format(num);
}
```

</div>
به همین راحتی! نیازی نیست یه تابع عجیب غریب براش بنویسید. تازه امکانات خیلی بیشتری هم بهتون میده. مثلا میتونید برای عدد ها جدا کننده بگذارید (۳ رقم ۳ رقم عدد هارو با یه کاما از هم جدا میکنه):

<div dir="ltr">

```js
new Intl.NumberFormat("fa").format(1000000, { useGrouping: true }); // ۱٬۰۰۰٬۰۰۰
```

</div>

البته این مورد به صورت پیشفرض true هست. یا میتونید علامت + و - رو برای عدد نشون بدید یا تعداد صفر های پشت عدد رو مشخص کنید و خیلی چیز های دیگه. با توجه به امکاناتی که بهتون میده استفاده از تابع هایی که دیدید یکم احمقانه هست.

البته Intl نمیتونه عدد های فارسی رو به انگلیسی تبدیل کنه که خیلی خیلی کم پیش میاد. برای من به شخصه هیچوقت پیش نیومده.

یه نکته مهم در مورد toFarsiNumber3 هست که اون رو کند میکنه. الان با هر بار اجرا شدن این تابع یه formatter جدید ساخته میشه که کاملا غیر ضروری هست. اگر یه formatter با تنظیمات مشخصی داشته باشید میتونید هرجا که خواستید ازش استفاده کنید:

<div dir="ltr">

```js
const formatter = new Intl.NumberFormat("fa");
formatter.format(1);
formatter.format(1000);
formatter.format(1000000);
```

</div>

و این به اندازه ۲ تا تابعی که اول دیدید سریعه. ولی اگر بخواید هر دفعه یه formatter جدید بسازید ممکنه تو سرعت سایت تاثیر منفی بگذاره. مخصوصا اگر خیلی عدد داشته باشید. با اضافه کردن یه سیستم کش ساده میتونید مشکل رو حل کنید:

<div dir="ltr">

```js
const cache = new Map();
function toFarsiNumber3(num, options) {
    let cacheKey = options ? Object.entries(options).sort((a, b) => (a[0] < b[0] ? -1 : 1)).join() : "";
    let formatter;
    if (cache.has(cacheKey)) {
        formatter = cache.get(cacheKey)!;
    } else {
        formatter = new Intl.NumberFormat("fa", options);
        cache.set(cacheKey, formatter);
    }
    return formatter.format(num)
}
```

</div>
و این به اندازه ای سریع هست که هیچ مشکلی براتون پیش نیاد.

علاوه بر این، Intl کار های خیلی بیشتری هم میتونه بکنه که بعدا در موردش مینویسم. اگر کنجکاوید خودتون تحقیق کنید.
