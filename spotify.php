<?php
header('Content-Type: application/json');

if (!isset($_GET['mood']) || empty(trim($_GET['mood']))) {
    http_response_code(400);
    echo json_encode(['error' => 'No mood provided']);
    exit;
}

$mood = trim($_GET['mood']);

$client_id = 'a9d7108aefc6455dad42dc8a189f6a66';
$client_secret = 'dd382655cb60444882aca55ef30e64b0';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://accounts.spotify.com/api/token');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, 'grant_type=client_credentials');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Basic ' . base64_encode("$client_id:$client_secret")
]);
$token_response_raw = curl_exec($ch);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['error' => 'Token request failed: ' . curl_error($ch)]);
    curl_close($ch);
    exit;
}

$token_response = json_decode($token_response_raw, true);
curl_close($ch);

if (!isset($token_response['access_token'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Unable to get token']);
    exit;
}

$access_token = $token_response['access_token'];

$search_query = urlencode($mood . " mood");
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.spotify.com/v1/search?q=$search_query&type=playlist&limit=5");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $access_token"
]);
$response = curl_exec($ch);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL error: ' . curl_error($ch)]);
    curl_close($ch);
    exit;
}

curl_close($ch);

echo $response;
