<?php
/**
 * Прокси к Google Таблице с прайсом для статического сайта Shati Studio.
 *
 * Браузер запрашивает /prices.php (тот же домен — без проблем с CORS),
 * скрипт читает CSV из Google Таблицы и отдаёт его. Результат кэшируется
 * на 5 минут, чтобы не дёргать Google на каждый запрос.
 *
 * Чтобы цены подтягивались, таблица должна быть открыта на чтение:
 *   «Поделиться» → «Доступ по ссылке» → «Читатель».
 *
 * ID/лист таблицы можно поменять ниже.
 */

$SHEET_ID  = "1_Rcd5Md8KeO8Tufluf_YZVnb6iwV_11lPYBxTRXc14Y";
$SHEET_GID = "133399415";
$TTL       = 300; // секунд

$url = "https://docs.google.com/spreadsheets/d/" . $SHEET_ID
     . "/export?format=csv&gid=" . rawurlencode($SHEET_GID);
$cacheFile = __DIR__ . "/.prices-cache.csv";

header("Content-Type: text/csv; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Cache-Control: public, max-age=" . $TTL);

// 1) Свежий кэш — отдаём сразу.
if (is_readable($cacheFile) && (time() - filemtime($cacheFile) < $TTL)) {
    readfile($cacheFile);
    exit;
}

// 2) Тянем из Google Таблицы.
$csv = false;
if (function_exists("curl_init")) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 8,
        CURLOPT_USERAGENT      => "ShatiStudio/1.0",
    ]);
    $result = curl_exec($ch);
    $code   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($result !== false && $code >= 200 && $code < 300) {
        $csv = $result;
    }
} elseif (ini_get("allow_url_fopen")) {
    $ctx = stream_context_create(["http" => ["timeout" => 8]]);
    $result = @file_get_contents($url, false, $ctx);
    if ($result !== false) {
        $csv = $result;
    }
}

// 3) Получили нормальный CSV (не HTML-страницу входа) — кэшируем и отдаём.
if ($csv !== false && strlen($csv) > 0 && substr(ltrim($csv), 0, 1) !== "<") {
    @file_put_contents($cacheFile, $csv);
    echo $csv;
    exit;
}

// 4) Не вышло — отдаём прошлый кэш, если он есть.
if (is_readable($cacheFile)) {
    readfile($cacheFile);
    exit;
}

// 5) Совсем ничего — пусто. Сайт покажет цены, заложенные при сборке.
http_response_code(204);
