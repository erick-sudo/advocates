onSubmit={handleNewCaseSubmision}
          inputFields={[
            {
              name: "title",
              as: "text",
              required: true,
            },
            {
              name: "description",
              as: "textarea",
              required: true,
            },
            {
              name: "case_no_or_parties",
              as: "text",
              required: true,
            },
            {
              name: "record",
              as: "text",
              required: true,
            },
            {
              name: "file_reference",
              as: "text",
              required: true,
            },
            {
              name: "clients_reference",
              as: "text",
              required: true,
            },
            {
              name: "client_id",
              as: "select",
              required: true,
              label: "Select Client",
              options: clients.map((cl) => ({ value: cl.id, label: cl.name })),
            },
          ]}
          anchorText="New Case"
          submitText="Save Case"
          description="Create New Case"