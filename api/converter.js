// converter.js
const fs = require('fs');

try {
  // STEP 1: Reads the file named 'students.json' from the same folder.
  const jsonData = fs.readFileSync('students.json', 'utf-8');
  
  // STEP 2: Tries to parse the text into a JavaScript array. Fails if JSON is invalid.
  const students = JSON.parse(jsonData);

  // STEP 3: Loops through each student to create the SQL string.
  const values = students.map(student => {
    // Fails if "Roll No" or "Student Name" keys are missing or misspelled in the JSON.
    const rollNo = student["Roll No"]; 
    const name = student["Student Name"].replace(/'/g, "''"); // Escapes single quotes

    if (!rollNo || !name) {
      throw new Error('A student object is missing "Roll No" or "Student Name"');
    }

    return `('${rollNo}', '${name}')`;
  }).join(',\n');
  
  const sqlStatement = `INSERT INTO \`students\` (\`roll_no\`, \`name\`) VALUES\n${values};`;

  // STEP 4: Writes the final SQL to a new file.
  fs.writeFileSync('students_insert.sql', sqlStatement);

  console.log('✅ Success! Your SQL file "students_insert.sql" has been created.');

} catch (error) {
  // This will catch any errors and tell you what went wrong.
  console.error('\n❌ ERROR: The script failed. Here is the reason:\n');
  console.error(error.message);
  console.error('\nPlease check the steps above, especially using a JSON validator.\n');
}