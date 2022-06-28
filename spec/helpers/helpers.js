/** 
 * Storage Mock from on https://stackoverflow.com/a/26177872
 */
function storageMock() {
    let storage = {};

    return {
      setItem: function(key, value) {
        storage[key] = value || '';
      },
      getItem: function(key) {
        return key in storage ? storage[key] : null;
      },
      removeItem: function(key) {
        delete storage[key];
      },
      get length() {
        return Object.keys(storage).length;
      },
      key: function(i) {
        const keys = Object.keys(storage);
        return keys[i] || null;
      }
    };
}

// mock the localStorage
global.localStorage = storageMock();
// mock the sessionStorage
global.sessionStorage = storageMock();