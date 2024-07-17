
function Validator(formSelector) {

    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    var formRules = {}

    var validatorRules = {
        required: function (value) {
            return value ? undefined : 'Trường này là bắt buộc'
        },
        email: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Trường này phải là email'
        },
        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`
            }
        },
        max: function (max) {
            return function (value) {
                return value.length <= max ? undefined : `Vui lòng nhập tối đa ${min} ký tự`
            }
        },
        confirmed: function (value) {
            return value === document.querySelector(`${formSelector} #password`).value ? undefined : 'Giá trị nhập vào không chính xác'
        }
    }




    var formElement = document.querySelector(formSelector)

    if (formElement) {

        var inputs = formElement.querySelectorAll('[name][rules]')

        // console.log(inputs)

        for (var input of inputs) {
            var rules = input.getAttribute('rules').split('|')

            for (var rule of rules) {
                var ruleInfo
                var isRuleHasValue = rule.includes(':')

                if (isRuleHasValue) {
                    ruleInfo = rule.split(':')
                    rule = ruleInfo[0]
                }

                var ruleFunc = validatorRules[rule]

                if (isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1])
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc)
                } else {
                    formRules[input.name] = [ruleFunc]
                }
            }



            // Lắng nghe sự kiện để validate (blur, change, ...)

            input.onblur = handleValidate
            input.oninput = handleClearError
        }

        // Hàm thực hiện validate
        function handleValidate(event) {
            var rules = formRules[event.target.name]

            var errorMessage

            for (var rule of rules) {
                errorMessage = rule(event.target.value)
                if (errorMessage) break
            }

            // Nếu có lỗi thì hiện thị message lỗi ra UI
            if (errorMessage) {
                var formGroup = getParent(event.target, '.form-group')

                if (formGroup) {
                    var formMessage = formGroup.querySelector('.form-message')

                    if (formMessage) {
                        formMessage.innerText = errorMessage

                        formGroup.classList.add('invalid')
                    }

                }

            }

            return !errorMessage
        }

        //Hàm clear message lỗi
        function handleClearError(event) {
            var formGroup = getParent(event.target, '.form-group')
            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid')
                var formMessage = formGroup.querySelector('.form-message')
                if (formMessage) {
                    formMessage.innerText = ''
                }
            }

        }

        var _this = this

        // Xử lý hành vi submit form
        formElement.onsubmit = function (event) {
            event.preventDefault();

            var inputs = formElement.querySelectorAll('[name][rules]')
            var isValid = true

            for (var input of inputs) {
                if (!handleValidate({ target: input })) {
                    isValid = false
                }
            }

            // Khi không có lỗi thì submit
            if (isValid) {
                if (typeof _this.onSubmit == 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]')

                    var formValues = Array.from(enableInputs).reduce(function (values, input) {

                        switch (input.type) {
                            case 'radio':
                                if (input.checked) {
                                    values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value
                                }
                                break
                            case 'checkbox':
                                if (!values[input.name]) {
                                    values[input.name] = []
                                }
                                if (input.checked) {
                                    values[input.name].push(input.value)
                                }
                                break
                            case 'file':
                                values[input.name] = input.files
                                break
                            default:
                                values[input.name] = input.value
                        }

                        return values
                    }, {})

                    _this.onSubmit(formValues);
                } else {
                    formElement.submit();
                }
            }

        }

        // console.log(formRules)

    }


}