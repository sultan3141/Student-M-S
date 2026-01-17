<?php
echo "DB_DATABASE from getenv: '" . getenv('DB_DATABASE') . "'\n";
echo "DB_DATABASE from \$_ENV: '" . ($_ENV['DB_DATABASE'] ?? 'unset') . "'\n";
echo "DB_DATABASE from \$_SERVER: '" . ($_SERVER['DB_DATABASE'] ?? 'unset') . "'\n";
