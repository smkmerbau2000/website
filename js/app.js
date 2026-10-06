const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

/* =====================================================
           DOM ELEMENTS
        ===================================================== */

        const tableBody =
            document.getElementById(
                "studentTableBody"
            );

        const counter =
            document.getElementById(
                "studentCounter"
            );

        const connectionStatus =
            document.getElementById(
                "connectionStatus"
            );

        const connectionMessage =
            document.getElementById(
                "connectionMessage"
            );


        /* =====================================================
           CONNECTION STATUS
        ===================================================== */

        function setConnectionStatus(
            type,
            message
        ) {

            connectionStatus.classList.remove(
                "loading",
                "success",
                "error"
            );

            connectionStatus.classList.add(type);

            connectionMessage.textContent =
                message;
        }


        /* =====================================================
           UPDATE COUNTER
        ===================================================== */

        function updateCounter(total) {

            counter.textContent =
                `${total} Student${total === 1 ? "" : "s"}`;
        }


        /* =====================================================
           HTML ESCAPING
        ===================================================== */

        function escapeHtml(value) {

            if (
                value === null ||
                value === undefined
            ) {
                return "";
            }

            return String(value)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }


        /* =====================================================
           LOADING STATE
        ===================================================== */

        function showLoading() {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="3"
                        class="table-state"
                    >

                        <span
                            class="loading-spinner"
                        ></span>

                        Loading student records...

                    </td>

                </tr>

            `;
        }


        /* =====================================================
           ERROR STATE
        ===================================================== */

        function showError(message) {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="3"
                        class="table-state error"
                    >

                        ${escapeHtml(message)}

                    </td>

                </tr>

            `;

            updateCounter(0);
        }


        /* =====================================================
           EMPTY STATE
        ===================================================== */

        function showEmptyState() {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="3"
                        class="table-state"
                    >

                        No student records found.

                    </td>

                </tr>

            `;

            updateCounter(0);
        }


        /* =====================================================
           RENDER STUDENTS
        ===================================================== */

        function renderStudents(students) {

            if (
                !Array.isArray(students)
            ) {

                throw new Error(
                    "Invalid student data."
                );
            }


            if (
                students.length === 0
            ) {

                showEmptyState();

                return;
            }


            updateCounter(
                students.length
            );


            tableBody.innerHTML = "";


            students.forEach(student => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>

                        <span class="student-id">
                            ${escapeHtml(
                                student.student_id
                            )}
                        </span>

                    </td>


                    <td>

                        <span class="student-name">
                            ${escapeHtml(
                                student.full_name
                            )}
                        </span>

                        <span class="student-email">
                            ${escapeHtml(
                                student.email
                            )}
                        </span>

                    </td>


                    <td>

                        <span class="student-course">
                            ${escapeHtml(
                                student.course
                            )}
                        </span>

                    </td>

                `;


                tableBody.appendChild(row);

            });
        }


        /* =====================================================
           GET STUDENTS FROM SUPABASE
        ===================================================== */

        async function fetchStudents(options = {}) {
    const maxAttempts = options.maxAttempts ?? 3;
    const retryDelayMs = options.retryDelayMs ?? 1000;

    showLoading();
    setConnectionStatus("loading", "Connecting to Supabase...");

    let lastError = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const { data, error } = await supabaseClient
                .from(TABLE_NAME)
                .select("student_id, full_name, email, course")
                .order("student_id", { ascending: true });

            if (error) {
                throw error;
            }

            renderStudents(data);
            setConnectionStatus("success", "Connected to Supabase");
            return true;

        } catch (error) {
            lastError = error;

            console.warn(
                `Supabase request failed (attempt ${attempt}/${maxAttempts})`,
                error
            );

            if (attempt < maxAttempts) {
                setConnectionStatus(
                    "loading",
                    `Connection issue. Retrying (${attempt}/${maxAttempts})...`
                );

                await new Promise(resolve =>
                    setTimeout(resolve, retryDelayMs * attempt)
                );
            }
        }
    }

    console.error("Supabase error after all retries:", lastError);

    setConnectionStatus(
        "error",
        "Unable to connect to Supabase"
    );

    showError(
        "Unable to load student records. Please refresh the page and try again."
    );

    return false;
}

/* =====================================================
           INITIALIZE
        ===================================================== */

        document.addEventListener(
            "DOMContentLoaded",
            fetchStudents
        );
