from re import compile, search, sub

description_quote_regex = compile("'")
description_a_regex = compile("<a href=.*>.*</a>")


def description_fixer(description):
    global description_quote_regex, description_a_regex
    description = sub(description_quote_regex, "\\'", description)
    while True:
        match = search(description_a_regex, description)
        if match:
            start_index = match.span()[0]
            end_index = description.find(">", start_index)
            description = description[0:start_index] + description[end_index + 1:]
        else:
            description = description.replace("</a>", "")
            break
    return description
