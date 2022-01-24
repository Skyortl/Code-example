const records = Object.values(
    takedowns.reduce((acc, val, i, arr) => {
    const foundIndex = arr.findIndex(takedown => equalTakedowns(val, takedown));
    if(foundIndex === i) {
        acc[i] = [val];
    } else {
        acc[foundIndex].push(val);
    }
    return acc;
}, {}))
    .filter(arr => arr.length > 1)
    .reduce((records, [unique, ...duplicates]) => {
        const config = {};
        const newUnique = {
            ...duplicates.reduce((acc, duplicate) => {
                return {
                    ...duplicate,
                    ...acc,
                }
            }, {}),
            ...unique
        }
        newUnique.last_duplicate_date = duplicates
            .map(obj => parseDate(obj.last_duplicate_date))
            .find(date => date > parseDate(unique.last_duplicate_date)) || '';
        newUnique.duplicate_counter = duplicates
            .reduce((acc, duplicate) => acc + (+duplicate.duplicate_counter), +unique.duplicate_counter || 0);
        config.set = Object.keys(newUnique).length !== Object.keys(unique).length;
        config.update = parseDate(newUnique.last_duplicate_date) > parseDate(unique.last_duplicate_date);
        config.sum = newUnique.duplicate_counter > unique.duplicate_counter;
        records.duplicates.push(...duplicates.map(duplicate => duplicate.process_id));
        if(Object.newUniques(config).some(val => val)) {
            records.unique.push(newUnique);
        }
        return records;
    }, {duplicates: [], unique: []});
