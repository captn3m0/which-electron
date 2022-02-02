<?php

const VERSION_EXCLUDE = ['nightly', 'beta', 'alpha'];
// The latest four stable major versions are currently supported
// till May 2022, after which only 3 major versions will be supported
const SUPPORTED_MAJOR_VERSIONS = [14, 15, 16, 17];

function get_versions() {
    `rm -rf electron-src`;
    `git clone https://github.com/electron/electron.git electron-src`;
    chdir("electron-src");

    $versions = [];
    foreach(explode("\n", shell_exec("git tag -l")) as $version) {
        foreach(VERSION_EXCLUDE as $needle) {
            if (stripos($version, $needle) !== false) {
                continue 2;
            }
        }
        // Atom shell was renamed to electron in this release (17th April 2015)
        if (version_compare($version, 'v0.24.0', '<')) {
            continue;
        }

        $versions[] = $version;
    }

    chdir("..");
    `rm -rf electron-src`;

    return $versions;
}

function get_major_version($version) : int {
    $r = explode('.', $version);
    return intval($r[0]);
}

function get_supported_versions($versions = []) {
    $result = [];
    $versions = array_map(function($v) {
      return substr($v, 1);
    }, $versions);

    foreach(SUPPORTED_MAJOR_VERSIONS as $major) {
        $result[$major] = '0.0.0';
    }

    foreach($versions as $version) {
        $major = get_major_version($version);
        if (in_array($major, SUPPORTED_MAJOR_VERSIONS)) {
            if (version_compare($version, $result["$major"], '>')) {
                $result["$major"] = "v$version";
            }
        }
    }

    return array_values($result);
}

function json_data() {
    $versions = get_versions();
    usort($versions, 'version_compare');
    $supported = get_supported_versions($versions);
    return [
        'supported' => $supported,
        'all' => $versions
    ];
}

file_put_contents('src/versions.json', json_encode(json_data(), JSON_PRETTY_PRINT));
