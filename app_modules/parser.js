parser = {

    createDoc: function (request) {
        let query = {};

        Object.keys(request).forEach((element) => {

            if (element != 'page') {

                switch (element) {
                    case 'day':
                        !query.date ? query.date = {[element]: parseInt(request[element])} : query.date[element] = parseInt(request[element]);
                        break;
                    case 'month':
                        !query.date ? query.date = {[element]: parseInt(request[element])} : query.date[element] = parseInt(request[element]);
                        break;
                    case 'year':
                        !query.date ? query.date = {[element]: parseInt(request[element])} : query.date[element] = parseInt(request[element]);
                        break;
                    case 'city':
                        !query.location ? query.location = {[element]: request[element]} : query.location[element] = request[element];
                        break;
                    case 'state':
                        !query.location ? query.location = {[element]: request[element]} : query.location[element] = request[element];
                        break;
                    case 'country':
                        !query.location ? query.location = {[element]: request[element]} : query.location[element] = request[element];
                        break;
                    case 'venue':
                        !query.meta ? query.meta = {[element]: request[element]} : query.meta[element] = request[element];
                        break;
                    case 'occasion':
                        !query.meta ? query.meta = {[element]: request[element]} : query.meta[element] = request[element];
                        break;
                    case 'names':
                        let names = splitAndTrim(request[element]);
                        !query.meta ? query.meta = {[element]: names} : query.meta[element] = names;
                        break;
                    case 'keywords':
                        let keywords = splitAndTrim(request[element]);
                        !query.meta ? query.meta = {[element]: keywords} : query.meta[element] = keywords;
                        break;
                    case 'da':
                        !query.meta ? query.meta = {[element] : { da: request[elem].da }} : query.meta[element] = { da: request[element].da };
                        break;
                    case 'en':
                        !query.meta ? query.meta = {[element] : { en: request[elem].en }} : query.meta[element] = { en: request[element].en };
                        break;
                    case 'fileName':
                        !query.image ? query.image = {[element]: request[element]} : query.date[element] = request[element];
                        break;
                    default:
                        query[element] = request[element];
                        break;
                }
            }
        })
        // console.log('query p: ', query);
        return query;
    },

    parseUpdateQuery: function (request) {

        let query;

        Object.keys(request).forEach((key) => {

            console.log(key);

            if (key != 'page') {
                switch (key) {
                    case 'city':
                        return  query = { "location.city" : request[key] };
                    case 'state':
                        return  query = { "location.state" : request[key] };
                    case 'country':
                        return  query = { "location.country" : request[key] };
                    case 'day':
                        return  query = { "date.day" : parseInt(request[key]) };
                    case 'month':
                        return  query = { "date.month" : parseInt(request[key])};
                    case 'year':
                        return  query = { "date.year" : parseInt(request[key]) };
                    case 'keywords':
                        let keywords = splitAndTrim(request[key]);
                        return query = { $push: {"meta.keywords": keywords }};
                    case 'names':
                        let names = splitAndTrim(request[key]);
                        return  query = { $push: {"meta.names" : names }};
                    case 'venue':
                        return  query = { "meta.venue" : request[key] };
                    case 'occasion':
                        return  query = { "meta.occasion" : request[key] };
                    case 'da':
                        return query = { "meta.event.da" : request[key] };
                    case 'en':
                        return query = { "meta.event.en": request[key] };
                    case 'fileName':
                        return  query = { "image.fileName" : request[key] };
                    case 'thumbnail':
                        return  query = { "image.thumbnail" : request[key] };
                    default:
                        return null;
                }
            }
        })

        return query;
    },


    parseSearchQuery: function (request, operator) {

        let query = [];

        Object.keys(request).forEach((key) => {

            if (key != 'page') {
                switch (key) {
                    case 'city':
                        query.push({ "location.city" : request[key] });
                        break;
                    case 'state':
                        query.push({ "location.state" : request[key] });
                        break;
                    case 'country':
                        query.push({ "location.country" : request[key] });
                        break;
                    case 'day':
                        query.push({ "date.day" : parseInt(request[key]) });
                        break;
                    case 'month':
                        query.push({ "date.month" : parseInt(request[key])});
                        break
                    case 'year':
                        query.push({ "date.year" : parseInt(request[key]) });
                        break;
                    case 'keywords':
                        let keywords = splitAndTrim(request[key]);
                        query.push({ "meta.keywords" : {$in : keywords }})
                    case 'names':
                        let names = splitAndTrim(request[key]);
                        query.push({ "meta.names" : {$in : names }});
                        break;
                    case 'venue':
                        query.push({"meta.venue" : request[key] });
                        break;
                    case 'occasion':
                        query.push({ "meta.occasion" : request[key] });
                        break;
                    case 'fileName':
                        query.push({ "image.fileName" : request[key] });
                        break;
                    case 'thumbnail':
                        query.push({ "image.thumbnail" : request[key] });
                        break;
                    default:
                        return null;
                }
            }
        })
        return query.length > 0 ? operator ? { $and : query } : { $or : query } : {} ;
    },

    parse: function(request) {
      let query = {};

      Object.keys(request).forEach((key) => {
            switch (key) {
                case 'keywords':
                  let keywords = splitAndTrim(request[key]);
                  query[convert(key)] = keywords;
                  break;
                case 'names':
                  let names = splitAndTrim(request[key]);
                  query[convert(key)] = names;
                  break;
                default:
                  query[convert(key)] = request[key];
                  break;
          }
      })
      return query;
    }

}

function convert(key) {
  if (key == 'city' || key == 'state' || key == 'country') {
    return `location.${key}`;
  }
  else if (key == 'day' || key == 'month' || key == 'year') {
    return `date.${key}`;
  }
  else if (key == 'keywords' || key == 'names' || key == 'venue' || key == 'occasion') {
    return `meta.${key}`;
  }
  else if (key == 'en' || key == 'da') {
    return `meta.event.${key}`;
  }
  else if (key == 'fileName' || key == 'thumbnail') {
    return `image.${key}`;
  }
  else {
    return null;
  }
}

function splitAndTrim(field) {
  let array = [];
  field.split(',').forEach((value) => {array.push(value.trim())});
  return array;
}

module.exports = parser;
